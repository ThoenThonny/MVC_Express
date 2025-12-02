import connect from "../config/db.js";

export default {
  async getAll() {
    const result = await connect.query(
      "SELECT * FROM tbl_students ORDER BY stu_id ASC"
    );
    return result.rows;
  },
  // get one students

  async getById(id) {
    const result = await connect.query(
      "SELECT * FROM tbl_students WHERE stu_id = $1",
      [id]
    );
    return result.rows[0];
  },
  // create students
  async create(data) {
    const Query = ` INSERT INTO tbl_students (stu_name, gender, profile, email)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;
    const result = await connect.query(Query,[
        data.stu_name,
        data.gender,
        data.profile,
        data.email,
        id
    ])
    return result.rows[0];
  },
  // update students

  async update(id,data){
    const Query = `UPDATE tbl_students
      SET stu_name=$1, gender=$2, profile=$3, email=$4
      WHERE stu_id=$5
      RETURNING *`;
    const result = await connect.query(Query,[
        data.stu_name,
        data.gender,
        data.profile,
        data.email
    ]);
    return result.rows[0];
  },

  // delete students

  async delete(id){
    await connect.query("DELETE FROM tbl_students WHERE stu_id=$1",[id]);
    return true;
  }
};
