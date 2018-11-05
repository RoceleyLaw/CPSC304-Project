//unused yet
var Schema = {
    user: {
      id: {type: 'increments', nullable: false},
      lastName: {type: 'string', maxlength: 254, nullable: false},
      firstName: {type: 'string', maxlength: 150, nullable: false},
      detailAddress: {type: 'string', maxlength: 150, nullable: false},
      city: {type: 'string', maxlength: 150, nullable: false}
    }
}
module.exports = Schema;