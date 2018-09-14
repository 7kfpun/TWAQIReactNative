package com.kfpun.twaqi;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactNativeQuickActions.AppShortcutsPackage;
import io.fabric.sdk.android.Fabric;
import com.airbnb.android.react.maps.MapsPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.horcrux.svg.SvgPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import io.invertase.firebase.RNFirebasePackage;

import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;

import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.crash.RNFirebaseCrashPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new AppShortcutsPackage(),
          new RNFirebaseAdMobPackage(),
          new RNFirebaseAnalyticsPackage(),
          new RNFirebaseCrashlyticsPackage(),
          new RNFirebaseCrashPackage(),
          new RNFirebasePerformancePackage(),
          new RNFirebaseRemoteConfigPackage(),
          new FabricPackage(),
          new MapsPackage(),
          new RNViewShotPackage(),
          new SvgPackage(),
          new ReactNativeOneSignalPackage(),
          new RNDeviceInfo(),
          new VectorIconsPackage(),
          new RNI18nPackage(),
          new RNFirebasePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics(), new Answers());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
