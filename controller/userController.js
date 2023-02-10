const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const aysncHandler = require("express-async-handler");

const uniqid = require("uniqid");

const { generateToken } = require("../config/jwtToken");

const validateMongoDbId = require("../utils/validateMongodbId");

const { generateRefreshToken } = require("../config/refreshToken");

const jwt = require("jsonwebtoken");

const sendEmail = require("./emailController");

const crypto = require("crypto");





const createUser = aysncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //create a new users
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Exists");
    }
});

const loginUserCtrl = aysncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user is exists or not https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6&index=27 here adding cookie-parser for refreshing token   timestamps : 1.59 hr/min
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//if (findAdmin.role !== "admin") throw new Error("Not Authorised");

//admin user controll  https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6 timestamps 7:20hr/min
const loginAdmin = aysncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user is exists or not https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6&index=27 here adding cookie-parser for refreshing token   timestamps : 1.59 hr/min
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
}); //here i forget to put admin-login route path as called in auth route 


//handle refresh token 

const handleRefreshToken = aysncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("NO Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        //   if(err|| user.name) 
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with Refresh Token");
        }
        else {
            const accessToken = generateToken(user?._id)
            res.json({ accessToken }); //https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6&index=27 timestamps 2.11hr/min
        }
    });
    res.json(user);
});

//logout functionality
const logout = aysncHandler(async (req, res) => {

    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);  //forbidden
    }

    await User.findOneAndUpdate(refreshToken, {
        refreshToken: " ",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); //forbidden
});


//update a user
const updatedUser = aysncHandler(async (req, res) => {
    console.log();
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body.firstname,
            lastname: req?.body.lastname,
            email: req?.body.email,
            mobile: req?.body.mobile
        }, {
            new: true,
        });
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

//save user address
const saveAddress = aysncHandler(async (req, res) => {
    console.log();
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req?.body.address,

            new: true,
        });
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

//get all users

const getallUser = aysncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

//get a single user

const getaUser = aysncHandler(async (req, res) => {
    // console.log(req.params);
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        })
    } catch (error) {
        throw new Error(error);
    }
});

//delete a user

const deleteaUser = aysncHandler(async (req, res) => {
    // console.log(req.params);
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = aysncHandler(async (req, res) => {
    // console.log(req.params);
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Blocked"
        });
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = aysncHandler(async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    validateMongoDbId(id); //validate mongoose id here for validation
    try {
        //timestamps 1:44/45 hr/min here we find error we didn't use await and find it true or false. 
        const unblock = await User.findByIdAndUpdate(id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User UnBlocked"
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = aysncHandler(async (req, res) => {
    //issuses i face password wont updated 
    //now 3:52 hr/min we install npm i nodemailer
    //timestamps 3:50/3hr:51min,52min   https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6  //here i face problem.
    try {
        const { _id } = req.user;

        await validateMongoDbId(_id);

        const user = await User.findById(_id);

        if (req.body && req.body.password) {
            user.password = req.body.password;

            const updatedPassword = await user.save();
        }

        return res.json(user);

    } catch (error) {
        throw error;
    }
});

// time stamps :4:07 hr/min https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6
const forgetPasswordToken = aysncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not Found with this email");
    try {
        // console.log("token", "token");
        const token = await user.createPasswordResetToken();
        await user.save();

        const resetURL = `Hi, please Follow this link to reset Your paasword. This Link is valid till 10 minutes from now . <a href='http://localhost:4004/api/user/reset-password/${token}'>Click here</a>`;

        const data = {
            to: email,
            text: " Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,

        };
        await sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }

});

//token called from usermodel. 
const resetPassword = aysncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getWishlist = aysncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist"); //here we populate for see more information about id. 7:30:26hr/min
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
}); //it will find at user model beside with address ber.


//here we using cart from cart model https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6 timestamps 7:46hr/min
const userCart = aysncHandler(async (req, res) => {

    const { cart } = req.body;
    const { _id } = req.user;

    validateMongoDbId(_id);

    try {
        let products = [];
        const user = await User.findById(_id); //check if user already have product in cart 

        const alreadyExistCart = await Cart.findOne({ orderby: user._id }) //7.49hr/min

        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }

        for (let i = 0; i < cart.length; i++) {

            let object = {};

            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;

            const getPrice = await Product.findById(cart[i]._id).select("price").exec();

            if (getPrice) object.price = getPrice.price;

            products.push(object);

        }
        //console.log(products);
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        // console.log(products, cartTotal);
        let newCart = await new Cart({
            products, cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);

    } catch (error) {
        throw new Error(error);
    }
}); ///when you find product cart by product _id then you get the total product cart list and make sure you put token in auth 

const getUserCart = aysncHandler(async (req, res) => {
    const { _id } = req.user;

    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
}); //timestamps : 8:02hr/min getCart information and populate with products to see whole information


const emptyCart = aysncHandler(async (req, res) => {
    const { _id } = req.user;

    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);

    } catch (error) {
        throw new Error(error);
    }
});

//import couponmodel into this route timestapms : 8:14hr/min
const applyCoupon = aysncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;

    validateMongoDbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });

    const { products, cartTotal } = await Cart.findOne({ orderby: user._id }).populate("products.product");
    let totalAfterDiscount = (
        cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount },
        { new: true }
    );
    res.json(totalAfterDiscount);
}); // error was giving because of i cant add any cart product in cart thats why it show error now it was fixed by create cart order.


const createOrder = aysncHandler(async (req, res) => {

    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        if (!COD) throw new Error("Create cash order failed");

        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = 0;

        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD", //cash on delivery
                amount: finalAmount,
                status: "CASH_ON_DELIVERY",
                created: Date.now(),
                currency: "usd",
            },

            orderby: user._id,
            orderStatus: "CASH_ON_DELIVERY", // I did mistake here because i missed i space on order model "not processed"

        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }, //8.35
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({ message: "success" });
    } catch (error) {
        throw new Error(error);
    }
});

//8.37hr/min thats how getorders works here.

const getOrders = aysncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userorders = await Order.findOne({ orderby: _id }).populate("products.product").exec(); //here exec is execute.
        res.json(userorders);
    } catch (error) {
        throw new Error(error);
    }
});


//8.42hr/min 
const updateOrderStatus = aysncHandler(async (req, res) => {

    //8.45hr/min

    const { status } = req.body;

    const { id } = req.params;

    validateMongoDbId(id);

    try {

        const updateOrderStatus = await Order.findByIdAndUpdate(id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );

        res.json(updateOrderStatus);


    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgetPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
};