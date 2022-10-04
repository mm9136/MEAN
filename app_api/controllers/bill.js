const mongoose = require("mongoose");
const PDF = require("html-pdf");
const Bill = mongoose.model("Bill");
const User = mongoose.model("User");


const getAll = (req, res)=>{
    Bill.find().populate("user", "_id firstname lastname email").exec((err, docs)=>{
        if(!docs.length) return res.status(404).json({"info": "There is no bill in database!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve bills!"});
        else res.status(200).json({"info": docs});
    });
};

const getById = (req, res)=>{
    Bill.findById(req.params.bill_id).populate("user", "_id firstname lastname email").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no bill with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve bill!"});
        else res.status(200).json({"info": docs});
    });
};
const getByUserId = (req, res)=>{
    Bill.find({"user": req.params.user_id}).populate("user", "_id firstname lastname email").exec((err, docs)=>{
        if(!docs.length) return res.status(404).json({"info": "There is no bill with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve bill!"});
        else res.status(200).json({"info": docs});
    });
};

const getUser = (req, res)=>{
    Bill.findById(req.params.bill_id).select("_id user").populate("user", "_id firstname lastname email").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no bill with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve bill!"});
        else res.status(200).json({"info": docs.user});
    });
};

const getBillPdf = (req, res)=>{
    Bill.findById(req.params.bill_id).populate("user", "_id firstname lastname email").exec((err, bill)=>{
        if(!bill) return res.status(404).json({"info": "There is no bill with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve bill!"});
        else {
            var html_head = 
                "<html>"+
                "<head>"+
                "<title>Order number "+ bill.order_number +"</title>"+
                "</head>"+
                "<body>"+
                "<h3 style='margin-bottom: 75px'>Order number "+ bill.order_number +"</h3><hr>"+
                "<h5>User: "+ bill.user.firstname + " " + bill.user.lastname +", date: "+ bill.date.getDate()+"."+(bill.date.getMonth()+1)+"."+bill.date.getFullYear() +"</h6><hr>"+
                "<table style='font-size:10px'>"+
                "<tr>"+
                "<th style='text-align: center'>DVD Name</th>"+
                "<th style='text-align: center'>DVD Price</th>"+
                "<th style='text-align: center'>Quantity</th>"+
                "<th style='text-align: center'>Movies</th>"+
                "</tr>";
            var html_foot = 
                "<tr>"+
                "<td colspan=2 style='text-align: left; padding-top: 6px'><b>Total: "+ bill.total +"&euro;</b></td>"+
                "</tr>"+
                "</table><hr>"+
                "<p style='bottom: 0; font-size: 8px'>MEST movies</p>"+
                "</body>"+
                "</html>";
            var html_body = "";
            var config = {
                "format": "A4",
                "orientation": "portrait",
                "border": {
                    "top": "3cm",           
                    "right": "2cm",
                    "bottom": "4cm",
                    "left": "2cm"
                },
                "footer": {"default": "<p style='font-size: 9px'>MEST movies</p>"}
            };
            for(var dvd of bill.dvd) {
                html_body+="<tr>";
                html_body+="<td>"+dvd.name+"</td>";
                html_body+="<td style='text-align: center'>"+dvd.price+"</td>";
                html_body+="<td style='text-align: center'>"+dvd.quantity+"</td>";
                
                html_body+="<td>";
                for(var i = 0; i<2 && i<dvd.movies.length; i++) {
                    html_body+=dvd.movies[i].title+" ("+dvd.movies[i].year+")";
                    if(i<2-1 && i<dvd.movies.length-1) html_body+=", ";
                }
                if(dvd.movies.length>2) html_body+=", ...";
                html_body+="</td></tr>";
            }
        }
        let html = html_head+html_body+html_foot;
        PDF.create(html, config).toBuffer((err, stream)=>{
            console.log(err);
            if(err) return res.status(500).json({"info": "Could not create receipt!"});
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=bill.pdf',
                    'Content-Length': stream.length
                });
                res.end(stream);
            }
        });
    });
}

const add = (req, res)=>{
   
    var bill = req.body;
    var user = bill.user;
    console.log(bill);
    console.log(bill.user);
    //console.log(bill.dvd[0].movies);
    
    User.findById(user).exec((err, us)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve user!"});
        if(!us) return res.status(404).json({"info": "There is no user with this id"});
        else {
            Bill.create(bill, (err, n)=>{
                if(err){
                    return res.status(500).json({"info": "Could not retrieve bill!"});}
                us.bills.push(n._id);
                console.log(n);
                us.save((err)=>{
                    if(err) return res.status(500).json({"info": "Could not retrieve bill!"});
                    res.status(201).json({"info": n});
                });
            });
        }
    });
                
}

module.exports = {
    getAll,
    getById,
    getUser,
    getBillPdf,
    getByUserId,
    add
};