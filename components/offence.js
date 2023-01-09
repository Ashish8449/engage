class offence {
  constructor(
    user_id,
    offender_id,
    loc_id,
    date_committed,
    category_id,
    victim_id
  ) {
    this.user_id = user_id;
    this.offender_id = offender_id;
    this.loc_id = loc_id;
    this.date_committed = date_committed;
    this.category_id = category_id;
    this.victim_id = victim_id;
  }
}
module.exports = { offence };
