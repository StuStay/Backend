const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.JWT;
        const decode = jwt.verify(token, 'AzerTy,5()');
        req.user = decode;
        console.log(req.user.role);
        next();
    } catch (error) {
        res.json({
            message: 'Authentication failed!',
        });
    }
};

const authenticateByAdmin = (req, res, next) => {
    try {
        const Role = req.cookies.Role;
        const token = req.cookies.JWT;
        const decode = jwt.verify(token, 'AzerTy,5()');

        if (Role === 'Admin' || Role === 'admin') {
            req.user = decode;
            next();
        } else {
            res.json({
                message: 'Admin Authentication failed!',
            });
        }
    } catch (error) {
        res.json({
            message: 'Admin Authentication failed!',
        });
    }
};

const authenticateByStudent = (req, res, next) => {
    try {
        const token = req.cookies.JWT;
        const Role = req.cookies.Role;
        const decode = jwt.verify(token, 'AzerTy,5()');

        if (Role === 'Student' || Role === 'student') {
            req.user = decode;
            next();
        } else {
            res.json({
                message: 'Student Authentication failed!',
            });
        }
    } catch (error) {
        res.json({
            message: 'Student Authentication failed due to error!',
        });
    }
};

const authenticateByProprietaire = (req, res, next) => {
    try {
        const Role = req.cookies.Role;
        const token = req.cookies.JWT;
        const decode = jwt.verify(token, 'AzerTy,5()');

        if (Role === 'Proprietaire' || Role === 'proprietaire') {
            req.user = decode;
            next();
        } else {
            res.json({
                message: 'Proprietaire Authentication failed!',
            });
        }
    } catch (error) {
        res.json({
            message: 'Proprietaire Authentication failed!',
        });
    }
};

const checkUser = (req, res, next) => {
    const UserID = req.cookies.UserID;
    User.findById(UserID)
        .then(response => {
            res.json({
                response,
            });
        })
        .catch(error => {
            res.json({
                message: 'An error occurred',
            });
        });
};

const authentif = {
    authenticate,
    authenticateByAdmin,
    authenticateByStudent,
    authenticateByProprietaire, 
    checkUser,
};
module.exports = authentif;
