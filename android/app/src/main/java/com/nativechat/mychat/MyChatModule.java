package com.nativechat.mychat;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import java.util.Map;

import com.qiscus.sdk.Qiscus;
import com.qiscus.sdk.data.local.QiscusCacheManager;
import com.qiscus.sdk.data.local.QiscusDataBaseHelper;
import com.qiscus.sdk.data.local.QiscusDataStore;
import com.qiscus.sdk.data.model.QiscusAccount;
import com.qiscus.sdk.data.model.QiscusChatConfig;
import com.qiscus.sdk.data.model.QiscusChatRoom;
import com.qiscus.sdk.data.remote.QiscusApi;
import com.qiscus.sdk.event.QiscusUserEvent;
import com.qiscus.sdk.service.QiscusPusherService;
import com.qiscus.sdk.ui.QiscusChatActivity;
import com.qiscus.sdk.ui.fragment.QiscusChatFragment;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

// these classes are required for playing the audio
// import android.media.MediaPlayer;
// import android.media.AudioManager;
public class MyChatModule extends ReactContextBaseJavaModule {
  private static final int CHAT_REQUEST = 20000;
  public MyChatModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "MyChatModule";
  }

  @ReactMethod
  public void login(
      final String email,
      final String username,
      final String avatar,
      final Callback successCallback
      ) {
    Qiscus.setUser(email, "userKey")
      .withUsername(username)
      .withAvatarUrl(avatar)
      .save(new Qiscus.SetUserListener() {
        @Override
        public void onSuccess(QiscusAccount qiscusAccount) {
          successCallback.invoke(email, username, avatar);
        }
        @Override
        public void onError(Throwable throwable) {
          throwable.printStackTrace();
        }
      });
  }
  @ReactMethod
  public void startChat(String email, String title) {
    final Activity currentActivity = getCurrentActivity();
    Qiscus.buildChatWith(email)
      .withTitle(title)
      .build(currentActivity, new Qiscus.ChatActivityBuilderListener() {
        @Override
        public void onSuccess(Intent intent) {
          currentActivity.startActivityForResult(intent, CHAT_REQUEST);
        }
        @Override
        public void onError(Throwable throwable) {
          throwable.printStackTrace();
        }
      });

  }
}



