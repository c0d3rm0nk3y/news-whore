import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.sql.Date;
import java.util.List;

/**
 * Created by User on 9/4/2014.
 */
public class MySQLiteHelper extends SQLiteOpenHelper {
  // based on tut' found here.. http://hmkcode.com/android-simple-sqlite-database-tutorial/
  private static final int DATABASE_VERSION = 1;
  private static final String DATABASE_NAME = "NWDB";

  public MySQLiteHelper(Context context) {
    super(context, DATABASE_NAME, null,DATABASE_VERSION);
  }

  @Override
  public void onCreate(SQLiteDatabase db) {
    // create the db table
    String CREATE_NEWS_TABLE = "CREATE TABLE news ( id TEXT PRIMARY KEY, title TEXT, published DATE, content TEXT)";

    db.execSQL(CREATE_NEWS_TABLE);
  }

  @Override
  public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
    // Drop older news table if existed.
    db.execSQL("DROP TABLE IF EXISTS news");
    // create fresh
    this.onCreate(db);
  }

  // news table name
  private static final String TABLE_NEWS = "news";
  // news table column namess
  private static final String KEY_ID = "id";
  private static final String KEY_TITLE = "title";
  private static final String KEY_PUBLISHED = "published";
  private static final String KEY_CONTENT = "content";

  private static final String[] COLUMNS = {KEY_ID, KEY_TITLE, KEY_PUBLISHED, KEY_CONTENT};

  public void addNews(News news) {


  }

  public News getNews(String id) {}

  public List<News> getAllNews() {


  }

  public int markRead(News news) {}
}
