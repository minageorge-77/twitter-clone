export const signup = async (req, res) => {
    res.json({
        data: "You hit the signup route!" 
    });
};

export const login = async (req, res) => {
    res.json({
        data: "You hit the login route!" 
    }); 
};

export const logout = async (req, res) => {
    res.json({
        data: "You hit the logout route!" 
    }); 
};