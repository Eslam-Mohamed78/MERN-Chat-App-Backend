import joi from "joi";

// There should not be validation >> because user doesn't
// need to enter the full name or email to get the result.
// just know how to make alternatives()

// export const allUsersSchema = joi.object({
//   search: joi
//     .alternatives()
//     .try(
//       joi.string().lowercase().email(), // for email
//       joi.string().alphanum().min(3).max(20) // for name
//     )
//     .error(new Error("Invalid email or userName")),
// });
