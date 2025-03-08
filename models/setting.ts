import mongoose from "mongoose";

interface ISetting {
  key: string;
  value: string;
}

/**
 * Setting Schema
 */
const settingSchema = new mongoose.Schema<ISetting>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
});
const Setting = mongoose.model<ISetting>("setting", settingSchema);

export default Setting;
