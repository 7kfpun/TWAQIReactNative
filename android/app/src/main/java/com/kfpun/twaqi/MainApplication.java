package com.kfpun.twaqi;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.smixx.fabric.FabricPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.mustansirzia.fused.FusedLocationPackage;
import com.syarul.rnalocation.RNALocation;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;
import io.fabric.sdk.android.Fabric;

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
          new FabricPackage(),
          new RNI18nPackage(),
          new FusedLocationPackage(),
          new RNALocation(),
          new ReactNativeOneSignalPackage(),
          new RNDeviceInfo(),
          new RNAdMobPackage(),
          new VectorIconsPackage(),
          new MapsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    Fabric.with(this, new Crashlytics(), new Answers());
  }
}
