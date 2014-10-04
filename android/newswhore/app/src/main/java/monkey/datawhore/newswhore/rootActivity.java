package monkey.datawhore.newswhore;

import com.google.android.gms.auth.GoogleAuthUtil;
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
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.PendingIntent;
import android.content.DialogInterface;
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
import android.widget.TextView;


public class rootActivity extends Activity implements ConnectionCallbacks,
                                                      OnConnectionFailedListener  {
  private static JSONObject   jObj = null;
  private static final String SAVED_PROGRESS = "sign_in_progress";
  private static final int    RC_SIGN_IN = 0;
  private static final int    STATE_DEFAULT = 0;
  private static final int    STATE_SIGN_IN = 1;
  private static final int    STATE_IN_PROGRESS = 2;
  private static final int    DIALOG_PLAY_SERVICE_ERROR = 0;

  private boolean mIntentInProgress;
  private boolean mSignInClicked;

  private int mSignInError;
  private int mSignInProgress;

  private PendingIntent mSignInIntent;
  private GoogleApiClient mGoogleApiClient;
  private ConnectionResult mConnectionResult;


  private TextView mTextView;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_root);

    mTextView = (TextView) findViewById(R.id.textView01);
    mTextView.setText("monkey hippy kitty puppy");
    if(savedInstanceState != null) {
      mSignInProgress = savedInstanceState.getInt(SAVED_PROGRESS, STATE_DEFAULT);
    }

    mGoogleApiClient = buildGoogleApiClient();

  }

  private GoogleApiClient buildGoogleApiClient() {
    mTextView.setText("buildGoogleApiClient()..");
    return new GoogleApiClient.Builder(this)
      .addConnectionCallbacks(this)
      .addOnConnectionFailedListener(this)
      .addApi(Plus.API, Plus.PlusOptions.builder().build())
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
      case R.id.getToken:
        getAuthToken();
      return true;
    case R.id.action_refresh:
      refreshContent();
      return true;
    case R.id.action_login:
      // update status
      mTextView.setText((CharSequence)"login taken..");
      Log.i("MONKEY_TAG", getString(R.string.status_signing_in));
      resolveSignInError();
      return true;
    default:
      return super.onOptionsItemSelected(item);
    }
  }

  private void getAuthToken() {

  }

  private void resolveSignInError() {
    mTextView.setText("resolveSignIn");
    if(mSignInIntent != null) {
      try {
        mSignInProgress = STATE_IN_PROGRESS;
        startIntentSenderForResult(mSignInIntent.getIntentSender(),
                                   RC_SIGN_IN, null, 0, 0, 0);
      } catch (IntentSender.SendIntentException e) {
        Log.i("MONKEY_TAG", "Sign in intent could not be sent: " + e.getLocalizedMessage());
        // The intent was canceled before it was sent.   attempt to connect to get an updated Connection Result
        mSignInProgress = STATE_SIGN_IN;
        mGoogleApiClient.connect();
      }
    } else {
      showDialog(DIALOG_PLAY_SERVICE_ERROR);
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
    mTextView.setText("onStart()..");
    mGoogleApiClient.connect();
  }

  protected void onStop() {
    super.onStop();
    mTextView.setText("onStop()..");
    if(mGoogleApiClient.isConnected()) {
      mGoogleApiClient.disconnect();
    }
  }

  @Override
  public void onConnected(Bundle bundle) {
    // We've resolved any connection errors.  mGoogleApiClient can be used to
    // access Google APIs on behalf the user.
    Log.i("MONKEY_TAG", "onConnected...");
    mTextView.setText("onConnected..");
    // update user interface.. blah blah blah
    /**
     *  get username..
     *  **/
     // update the ui to reflect..

    Person currentUser = Plus.PeopleApi.getCurrentPerson(mGoogleApiClient);

    mTextView.setText(currentUser.getDisplayName());
    Log.i("MONKEY_TAG", "current user: " + currentUser.getDisplayName());

    mSignInProgress = STATE_DEFAULT;

  }

  @Override
  public void onConnectionFailed(ConnectionResult result) {
    // refer to the javadoc for ConnectionResult to see what
    // error code might be returned in onConnectionFailed
    Log.i("MONKEY_TAG", "conConnecttionFailed: ConnectionResult.getErrorCode() = " + result.getErrorCode());
    mTextView.setText("onConnectionFailed..");
    if(mSignInProgress != STATE_IN_PROGRESS) {
      // we do not have an intent in progress so we should store the latest
      // error resolution intent to use when the sign in button is clicked
      mSignInIntent = result.getResolution();
      mSignInError = result.getErrorCode();
      if(mSignInProgress == STATE_SIGN_IN) {
        // STATE_SIGN_IN indicates the user already clicked the sign in button
        // wo we should continue processing errors until the user is signed in or
        // the clicked cancelled
        resolveSignInError();
      }
    }

    // in this sample we consider the user signed out whenever they do not have
    // a connection to Google Play Services
    onSignedOut();

//    if(!mIntentInProgress && result.hasResolution()) {
//      try {
//        mIntentInProgress = true;
//        startIntentSenderForResult(result.getResolution().getIntentSender(), RC_SIGN_IN, null, 0, 0, 0);
//      } catch (IntentSender.SendIntentException e) {
//        // The intent was canceled before it was sent.  Return to the default
//        // state and attempt to connect to get an update ConnectionResult
//        mIntentInProgress = false;
//        mGoogleApiClient.connect();
//      }
//    }
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    mTextView.setText("onSaveInstanceState");
    outState.putInt(SAVED_PROGRESS, mSignInProgress);
  }

  private void onSignedOut() {
    // update the UI

  }

  // The connection to Google play Services was lost for some reason (hippies)
  // We call connect to attempt to re-establish the connection or get a
  // ConnectionResult that we can attempt to resolve
  public void onConnectionSuspended(int cause) { mGoogleApiClient.connect(); }

  @Override
  protected Dialog onCreateDialog(int id) {
    switch(id) {
      case DIALOG_PLAY_SERVICE_ERROR:
        if(GooglePlayServicesUtil.isUserRecoverableError(mSignInError)) {
          return GooglePlayServicesUtil.getErrorDialog(
            mSignInError,
            this,
            RC_SIGN_IN,
            new DialogInterface.OnCancelListener() {
              @Override
              public void onCancel(DialogInterface dialog) {
                Log.e("MONKEY_TAG", "Google Play Services resolution cancelled");
                mSignInProgress = STATE_DEFAULT;
                mTextView.setText(R.string.status_signed_out);
              }
            });

        } else {
          return new AlertDialog.Builder(this)
            .setMessage(R.string.common_google_play_services_error)
            .setPositiveButton("Close",
              new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                  Log.e("MONKEY_TAG", "Google play services error could not be resolved: " + mSignInError);
                  mSignInProgress = STATE_DEFAULT;
                  mTextView.setText(R.string.status_signed_out);
                }
              }).create();

        }
        default:
          return super.onCreateDialog(id);
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
    switch(requestCode) {
      case RC_SIGN_IN:
        if(resultCode == RESULT_OK) {
          // if the error resoolution was successful we should continue processing errors.
          mSignInProgress = STATE_SIGN_IN;
        } else {
          // if the error resolution was not successful or the user canceled,
          // we should stop preocessing errors.
          mSignInProgress = STATE_DEFAULT;
        }

        if(!mGoogleApiClient.isConnecting()) {
          mGoogleApiClient.connect();
        }
      break;
    }



//    if(requestCode == RC_SIGN_IN) {
//      mIntentInProgress = false;
//      if(!mGoogleApiClient.isConnecting()) {
//        mGoogleApiClient.connect();
//      }
//    }
  }


}
