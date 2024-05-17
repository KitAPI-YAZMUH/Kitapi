const pool = require("../../db.js");
const { getBooksList,getUser } = require("./queries.js");
const crypto = require('crypto-js');

const getValue = async (req, res) => {

    try {
        const { value } = req.body;
        const bookStat = parseInt(value);
        const results = await pool.query(getBooksList, [req.session.userId, bookStat]);
        const books = results.rows;
        res.status(200).send({success:true,books});

    } catch (error) {
        console.error("Hata:", error);
        return res.status(500).send({ success: false, error: "Sunucu hatası" });
    }
};

const updateStudent = (req,res)=>{

    const id = parseInt(req.params.id);
    const {username, surname, email, password} = req.body; // form bilgileri req.body içinden geliyor
    const hashedPassword = crypto.SHA256(password).toString();

    pool.query("SELECT FROM users WHERE id = $1 AND password = $2",[id,hashedPassword], (error,results)=>{

        const noStudent = !results.rows.length;

        if(noStudent){
            return res.send("Şifreniz yanlış lütfen tekrar deneyiniz.");
        }
        else{
            pool.query("UPDATE users SET username = $1, surname = $2, email = $3 WHERE id = $4",
            [username, surname, email, id], (error,results)=>{
            if (error) throw error;
            return res.redirect('/chackout');
        })
        }
        
    });
}

const getUserInfo = async (req,res) =>{

    try{
        const userid = req.session.userId; 
        
        pool.query(getUser,[userid],(error,results)=>{ // userid ile kullanciyi databseden getirdim.
            if(error) throw error;
            
            if(results){ // eger kullaniciyi bulduytsa buraya girecek
                const {username, surname, email} = results.rows[0];
                return res.render('chackout',{name:username, surname : surname, email: email, username: req.session.username, userId: req.session.userId});
            }
            else{
                return res.render('chackout',{name : "", surname: "", email: "",username:"", userId: ""});
            }
        })

    }catch(error){
        console.log("fonksiyonda bir hata gerceklesti")
        return res.render('404');
    }
}

module.exports = {
    getValue,updateStudent,getUserInfo
};