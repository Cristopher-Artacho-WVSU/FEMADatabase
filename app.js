const express = require('express') //USING THE EXPRESS FILE
const {connectToDb, getDB} = require('./db') //USING THE .db FILE
const { ObjectId } = require('mongodb') //USING THE MONGODB FILE TO EXTRACT THE _id FIELD

//CALL 'app' AS 'express' function
const app = express()

//MAKING USE OF JSON FORMAT AND 'public' FOLDER FOR CSS
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('scripts'))
//MAKING USE OF THE EJS FILES IN THE CLIENT FOLDER AS THE ONLY FILE TO HOST
app.set('view engine', 'ejs');
// app.set('views', '/client')
app.set(express.static('client'))
app.set('views', __dirname + '/client');




//INTIIATE VARIABLE 'database' FOR OPERATIONS THAT INCLUDE THE DATABASE
let database

connectToDb((err) =>{
    //IF THERE IS NO ERROR, DISPLAYS THE STATEMENT AND TIMESTAMP ON CONSOLE
    if (!err){
        app.listen(3000, () => {
            console.log('App listening on port 3000')
            const currentTimeStamp = new Date();
            currentTimeStamp.setHours(currentTimeStamp.getHours() + 8)
            console.log('Local Hosted at Timestamp:', currentTimeStamp)
        })
        database = getDB()
    }
    //IF THERE IS AN ERROR, DISPLAYS THE ERROR ON THE CONSOLE
    else{
        consol.log(err)
    }
})

//localhost:3000/database/admin
//DISPLAYS THE FEMAAdminDB CONTENT IF SUCCESSFUL INTO JSON FORMAT
app.get('/database/admin', (req, res) => {
    let adminAccounts = [ ]
    
    database.collection('FEMAAdminDB')
    .find()
    .sort({
        adminFEMAID: 1
    })
    .forEach(account => adminAccounts.push(account))
    .then(() => {
        res.status(200).json(adminAccounts)
    })
    //IF THE ACCESS WAS DENIED OR COULD NOT ACCESS
    .catch(() => {
        res.status(200).json({
            error: 'Could not access the FEMAAdminDB'
        })
    })
})

//POSTS OR ADDS ANOTHER ACCOUNT INTO THE DATABASE BY JSON FORMAT
app.post('/database/admin', (req, res) => {
    const account = req.body
    console.log(account)

    database.collection('FEMAAdminDB')
    .insertOne(account)
    .then(result => {
        res.status(201)(result.ops[0]);
    })
    //IF THERE IS AN ERROR, DISPLAYS THE ERROR ON THE WEB DEVELOPER TOOLS
    .catch(err => {
        res.status(500).json({
            err: 'Could not post a new Admin Account'
        })
    })
})


//localhost:3000/database/members
//DISPLAYS THE FEMAMemberDB CONTENT IF SUCCESSFUL INTO JSON FORMAT
app.get('/database/members', (req, res) => {
    let memberAccounts = [ ]
    
    database.collection('FEMAMemberDB')
    .find()
    .sort({
        memberFEMAID: 1
    })
    .forEach(account => memberAccounts.push(account))
    .then(() => {
        res.status(200).json(memberAccounts)
    })
    //IF THE ACCESS WAS DENIED OR COULD NOT ACCESS
    .catch(() => {
        res.status(200).json({
            error: 'Could not access the FEMAMemberDB'
        })
    })
})

//POSTS OR ADDS ANOTHER ACCOUNT INTO THE DATABASE BY JSON FORMAT
app.post('/database/members', (req, res) => {
    const account = req.body
    console.log(account)

    database.collection('FEMAMemberDB')
    .insertOne(account)
    .then(result => {
        res.status(201).json(result.ops[0]);
    })
    //IF THERE IS AN ERROR, DISPLAYS THE ERROR ON THE WEB DEVELOPER TOOLS
    .catch(err => {
        res.status(500).json({
            err: 'Could not post a new Member Account'
        })
    })
})

// USE THE _id AS A PARAMETER FOR FETCHING AND MANIPULATING SINGLE DATA
app.get('/database/members/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        const memberObject_ID = new ObjectId(req.params.id);

        database.collection('FEMAMemberDB')
        // USES THE memberObject_ID AS A PARAMETER TO FIND THE DATA _id
            .findOne({
                _id: memberObject_ID
            })
            // IF THE DATA IS FOUND, SENDS IT TO THE localhost:3000/database/members/:id
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({
                        error: "Cannot Connect to the FEMAAdminDB"
                    })
                }
            })
    } else { //IF THERE IS A CONNECTION TO THE COLELCTION BUT CANNOT FIND THE _id
        res.status(500).json({error: 'Invalid data _id'})
    }
})

// UPDATE OR MAKE CHANGES IN THE DATA, THEN APPLY THE CHANGES IN THE COLLECTION
app.patch('/database/members/:id', (req, res) =>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        database.collection('FEMAMemberDB')
            .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
            .then(result => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'Document Cannot be Deleted' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not update document' });
            });
    } else {
        res.status(500).json({ error: 'Invalid Document ID' });
}})



//CREATE A CONTENT FOR THE LoanDB. DISPLAYS IT IN THE BROWSER USING THE LINK IN JSON FORMAT
app.get('/database/loans', (req, res) => {
    const memberLoans = [ ]

    database.collection('LoanDB')
    .find()
    .sort({
        memberFEMAID: 1
    })
    .forEach(loans => memberLoans.push(loans))
    .then(() => {
        res.status(200).json(memberLoans)
    })
    .catch(() => {
        res.status(200).json({
            error: 'Could not access LoanDB'
        })
    })
})

//POST OR ADD CONTENT TO THE LoanDB COLLECTION
app.post('/database/loans', (req, res) => {
    const loan = req.body
    console.log(loan)

    database.collection('LoanDB')
    .insertOne(loan)
    .then(result => {
        res.status(201).json(result.ops[0]);
    })
    .catch(err => {
        res.status(500).json({
            err: 'Unable to send Loan Data'
        })
    })
})



//THE LINK BELOW TO RENDER THE EJS FILES IN THE 'client' FOLDER
app.get('/FEMA-Mutual-Fund-System', (req, res) => {
    //THE LOGIN PAGE
    res.render('index')
})

app.get('/FEMA-Mutual-Fund-System/dashboard', (req, res) => {
    //THE DASHBOARD
    res.render('dashboard')
})

app.get('/FEMA-Mutual-Fund-System/add-loan', (req, res) => {
    //THE ADD NEW LOANS
    res.render('add_newLoan')
})

app.get('/FEMA-Mutual-Fund-System/members', (req, res) => {
    //THE MEMBER TAB
    res.render('display_totalMembers')
})

app.get('/FEMA-Mutual-Fund-System/loan-history', (req, res) => {
    //THE HISTORY PAGE
    res.render('display_loanHistory')
})

app.get('/FEMA-Mutual-Fund-System/add-members', (req, res) => {
    res.render('add_newMembers')
})