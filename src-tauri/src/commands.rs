const INTERVAL: u64 = 30;
const SKEW: i64 = 2;

#[tauri::command]
pub fn generate_totp(argument: String) -> Result<String, String> {
  if argument.len() > 0 {
    match otp::make_totp(&(argument.to_ascii_uppercase()), INTERVAL, SKEW) {
      // pad with zeros
      Ok(totp) => Ok(format!("{:06}", totp)),
      Err(_err) => Err("Error generating TOTP".into()),
    }
  } else {
    Err("Cannot generate TOPT for empty secret".into())
  }
}
