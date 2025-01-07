const Razorpay = require("razorpay");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_cFl2mURh2ctyuW",
  key_secret: "a1GDaegilMCDBOJMKEE5iRNa",
});

exports.createOrder = async (req, res, next) => {
  try {
    const amount = req.body.amount * 100;
    console.log(req.body)
    var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_1111"
      };
    // razorpayInstance.orders.create(options, function(err, order) {
    //     console.log(order);
    //     res.status(200).send({
    //         order:order
    //     })
    // });

    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        res.status(200).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: order.amount,
          key_id: 'rzp_test_cFl2mURh2ctyuW',
          product_name: req.body.product_name,
          description: req.body.product_desc,
          contact: req.body.contact,
          name: req.body.name,
          email: req.body.email,
        });
      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" ,error:err});
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
