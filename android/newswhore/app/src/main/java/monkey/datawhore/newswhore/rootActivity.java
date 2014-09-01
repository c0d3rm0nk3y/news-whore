package monkey.datawhore.newswhore;

import android.app.Activity;
import android.os.Bundle;
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


public class rootActivity extends Activity {
private static JSONObject jObj = null;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_root);
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
    default:
      return super.onOptionsItemSelected(item);
    }
  }

  private static String url = "http://monkey-nodejs-71725.usw1.nitrousbox.com:8080/api/todaysnews?view=title+words+link&count=10";

  private void refreshContent() {
    InputStream is = null;
    String json = null;
    try {

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
    } catch(Exception e) { e.printStackTrace(); }

    try {
      jObj = new JSONObject(json);
    } catch (JSONException e) { e.printStackTrace(); }
  }

  private void openSettings() {

  }
}
