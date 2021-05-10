var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bcrypt = require("bcrypt")

var UserSchema = new Schema(
  {
    name: String,
    email: { type: String, lowercase: true },
    sports: [String],
  },
  { timestamps: true }
);

UserSchema.pre("save", function(next){
if(this.password && this.isModified("password")){
Bcrypt.hash(this.password,10,(err,hashed)=>{
  if(err) return next(err);
  this.password= hashed;
  return next()
})
}
next()
})
var User = mongoose.model('User', UserSchema);
module.exports = User;