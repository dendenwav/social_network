// Extension de types pour mongoose
declare module "mongoose" {
    interface Document {
        _doc: any;
  }
}