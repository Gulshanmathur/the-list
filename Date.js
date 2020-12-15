// here below we also use module.exports.getDate = function (){ } instead of  exports.getDate
exports.getDate = function (){
const today = new Date();
    const options={
        weekday : "long",
        day :"numeric",
        month :"long",
        year :"numeric"
    };
    return today.toLocaleDateString("en-JP",options);
    
};
