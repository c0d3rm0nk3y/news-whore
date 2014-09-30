package monkey.datawhore.newswhore;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.plus.Plus;
import com.google.android.gms.plus.model.people.Person;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;

import android.os.Message;
import android.util.JsonReader;
import android.view.Menu;
import android.view.MenuItem;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import android.util.*;


public class rootActivity extends Activity implements ConnectionCallbacks,
                                                      OnConnectionFailedListener  {
  private static JSONObject jObj = null;
  private boolean mSignInClicked;
  private static final int RC_SIGN_IN = 0;
  private GoogleApiClient mGoogleApiClient;
  private boolean mIntentInProgress;
  private ConnectionResult mConnectionResult;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_root);

    mGoogleApiClient = new GoogleApiClient.Builder(this)
      .addConnectionCallbacks(this)
      .addOnConnectionFailedListener(this)
      .addApi(Plus.API)
      .addScope(Plus.SCOPE_PLUS_LOGIN)
      .build();
  }


  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.root, menu);
    return true;
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, so long
    // as you specify a parent activity in AndroidManifest.xml.
//    int id = item.getItemId();
//    if (id == R.id.action_settings) {
//      return true;
//    }
//    return super.onOptionsItemSelected(item);
    switch(item.getItemId()) {
    case R.id.action_settings:
      openSettings();
      return true;
    case R.id.action_refresh:
      refreshContent();
      return true;
    case R.id.action_login:

      return true;
    default:
      return super.onOptionsItemSelected(item);
    }
  }

  private static String url = "http://monkey-nodejs-71725.usw1.nitrousbox.com:8080/api/todaysnews?view=title+words+link&count=10";
	private static String TAG = "MONKEYTAG";
	
	private void refreshContent() {
    Log.e(TAG,"refreshContent()..");
    InputStream is = null;
    String json = null;
    try {
      Log.e(TAG,"Attempting DefaultHttpClient...");
      DefaultHttpClient client = new DefaultHttpClient();
      HttpPost post = new HttpPost(url);
      HttpResponse response = client.execute(post);
      HttpEntity entity = response.getEntity();
      is = entity.getContent();
    } catch(UnsupportedEncodingException e) { e.printStackTrace();
    } catch(ClientProtocolException e) { e.printStackTrace();
    } catch(IOException e) { e.printStackTrace(); }

    try {
      BufferedReader reader = new BufferedReader(new InputStreamReader(is, "iso-8859-1"), 8);
      StringBuilder sb = new StringBuilder();
      String line = null;
      while((line = reader.readLine()) != null) {
        sb.append(line + "n");
      }
      is.close();
      json = sb.toString();
			Log.e("Results", sb.toString());
    } catch(Exception e) { e.printStackTrace(); }

    try {
      jObj = new JSONObject(json);
    } catch (JSONException e) { e.printStackTrace(); }
  }
	
  private List readJsonStream(InputStream in) throws IOException {
    JsonReader reader = new JsonReader(new InputStreamReader(in));
    try {
      return readMessagesArray(reader);
    } finally {
        reader.close();
    }
  }

  private List readMessagesArray(JsonReader reader) throws IOException {
    List messages = new ArrayList();

    reader.beginArray();
    while(reader.hasNext()) {
      messages.add(readMessage(reader));
    }
    reader.endArray();
    return messages;
  }

  private boolean  readMessage(JsonReader reader) throws IOException {
    // vars for each
    // sense this is the root activity the three things will be included
    // String title, String id, and String[] words
    String title = null;
    String id = null;
    String link = null;
    List words = null;

    reader.beginObject();
    while(reader.hasNext()) {
      String name = reader.nextName();
      if(name.equals("title")) {
        title = reader.nextString();
      } else if(name.equals("_id")) {
        id = reader.nextString();
      } else if(name.equals("link")) {
        link  = reader.nextString();
      } else if(name.equals("words")) {
        words = readStringArray(reader);
      } else {
        reader.skipValue();
      }
    }
    reader.endObject();

    return true;
  }

  private List readStringArray(JsonReader reader) throws IOException {
    List words = new ArrayList();

    reader.beginArray();
    while(reader.hasNext()) {
      words.add(reader.nextString());
    }
    reader.endArray();

    return words;
  }

  private void openSettings() { }

  protected void onStart() {
    super.onStart();
    mGoogleApiClient.connect();
  }

  protected void onStop() {
    super.onStop();

    if(mGoogleApiClient.isConnected()) {
      mGoogleApiClient.disconnect();
    }
  }

  @Override
  public void onConnected(Bundle bundle) {
    // We've resolved any connection errors.  mGoogleApiClient can be used to
    // access Google APIs on behalf the user.

    /**
     *  get username..
     *  **/
     Log.i("MONKEYTAG", "onConnected..");
     // update the ui to reflect..

    Person currentUser = Plus.PeopleApi.getCurrentPerson(mGoogleApiClient);

    Log.i("MONKEYTAG", "current user: " + currentUser.getDisplayName());


  }



  @Override
  public void onConnectionFailed(ConnectionResult result) {
    if(!mIntentInProgress && result.hasResolution()) {
      try {
        mIntentInProgress = true;
        startIntentSenderForResult(result.getResolution().getIntentSender(), RC_SIGN_IN, null, 0, 0, 0);
      } catch (IntentSender.SendIntentException e) {
        // The intent was canceled before it was sent.  Return to the default
        // state and attempt to connect to get an update ConnectionResult
        mIntentInProgress = false;
        mGoogleApiClient.connect();
      }
    }
  }


  public void onConnectionSuspended(int cause) {
    mGoogleApiClient.connect();;
  }

  @Override
  protected void onActivityResult(int requestCode, int responseCode, Intent intent) {
    if(requestCode == RC_SIGN_IN) {
      mIntentInProgress = false;
      if(!mGoogleApiClient.isConnecting()) {
        mGoogleApiClient.connect();
      }
    }
  }
}
