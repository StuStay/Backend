import express from 'express';
import User from '../models/User.js';
import emailValidator from 'email-validator';

const all = (req, res, next) => {
    User.find()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}

const show = (req, res, next) => {
    User.findById(req.header("userID"))
        .then(user => {
            res.json({
                user
            })
        }).catch(error => {
            res.json({
                message: 'An error Occured'
            })
        })
}

const add = (req, res, next) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
        })
    if (emailValidator.validate(user.email)) {
        user.save()
            .then(response => {
                res.json({
                    message: 'user Added Successfully'
                })
  
            })
            .catch(error => {
                res.json({
                    message: 'An error Occured!'
                })
            })
  
    }
  else {
        res.json({
            message: 'wrong email adresse'
        })
    }
}

const updateProfile = async (req, res, next) => {
    const userId = req.header("userID");

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: req.body.name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone: req.body.phone,
                },
            },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Internal Server Error");
    }
};



  const changeAvatar = async (req, res) => {

    let user = await User.findByIdAndUpdate(req.header("UserID"),
        {
            $set: {
                avatar: req.file.filename
            }
        }
    );

    res.send({ user });
}

const destroy = (req, res, next) => {
    User.findByIdAndRemove(req.header("userID"))
        .then(() => {
            res.json({
                message: 'User deleted successfully!'
            })
        })
        .catch(error => {
            res.json({
                messaage: 'An error Occured'
            })
        })
}

const search = (req, res, next) => {
    var regex = new RegExp(req.body.name, 'i');
    User.find({ name: regex }).then((result) => {
        res.status(200).json(result)
    })

}

const UserController = {
    all,
    show,
    add,
    updateProfile,
    destroy,
    search,
    changeAvatar
    
};
export default UserController;

