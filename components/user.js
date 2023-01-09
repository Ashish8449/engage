class user {
  constructor(type, user_name, email, user_designation, password) {
    this.type = type;
    this.user_name = user_name;
    this.email = email;
    this.user_designation = user_designation;
    this.password = password;
  }
}
module.exports = { user };
