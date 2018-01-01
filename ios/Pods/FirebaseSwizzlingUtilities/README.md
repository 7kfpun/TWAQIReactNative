# Firebase Swizzling Utilities

Firebase Swizzling Utilities provide a thread safe, thoroughly unit-tested,
intuitive API for performing commmon types of swizzling. It is a support library
for Firebase products and does not have any public APIs.

Some Firebase SDKs perform method and isa swizzling. Please refer to the
documentation to see how we use swizzling and steps to disable it if needed.

* Documentation for [Firebase Performance SDK](https://firebase.google.com/docs/reference/swift/firebaseperformance/api/reference/Classes/Performance#/c:objc(cs)Performance(py)instrumentationEnabled)

For Other Firebase SDKs, developers who prefer not to use swizzling can disable
it by adding the flag FirebaseAppDelegateProxyEnabled in the app’s Info.plist
file and setting it to NO (boolean value).
