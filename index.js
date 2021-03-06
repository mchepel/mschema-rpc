var rpc = {},
    mschema = require("mschema");
var invoke = rpc.invoke = function (data, method, schema, callback) {
  var self = this;
  // validate incoming input data based on schema
  var validate = mschema.validate(data, schema.input, { strict: false });
  if (!validate.valid) {
    return callback(new Error('Validation error: ' + JSON.stringify(validate.errors, true, 2)), validate.errors);
  }
  // execute remote method
  method.call(self, data, function (err, result) {
    // if the executed method has errored continue with error immediately
    if (err) {
      return callback(err);
    }
    // if no error was detected in executing the method attempt to,
    // validate the method's output result based on schema
    var validate = mschema.validate(result, schema.output, { strict: false });
    if (!validate.valid) {
      callback.call(self, validate.errors, result);
    } else {
      callback.call(self, null, result);
    }
  });
}

module['exports'] = rpc;