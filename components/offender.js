class offender {
  constructor(user_id, age, gender, date_added, name, image_id) {
    this.user_id = user_id;
    this.age = age;
    this.gender = gender;
    this.date_added = date_added;
    this.name = name;
    this.image_id = image_id;
  }
}
module.exports = { offender };
