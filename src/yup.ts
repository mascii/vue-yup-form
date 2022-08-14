export * from "yup";

declare module "./yup" {
  // yup@0.32.11 does not export `Schema` interface.
  // To avoid import errors, define empty `Schema` interface here.
  interface Schema {}
}
