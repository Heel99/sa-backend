export class Regex {
  public static readonly PASSWORD = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,50}$/;
  public static readonly ZIP_CODE = /^[0-9]{5}(-[0-9]{4})?$/;
  public static readonly RANDOM_STRONG_PASSWORD = "abcdefghijklmnopqrstuvwxyz!@#$%^&*?()-+ABCDEFGHIJKLMNOP1234567890";
  public static readonly RECOVERY_CODE = "0123456789";
}
