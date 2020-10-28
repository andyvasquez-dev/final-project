module.exports = function(app, passport, db) {
  const ObjectId = require('mongodb').ObjectID

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
          res.render('index.ejs', {
            user : req.user,
          })
    });

    app.get('/userInfo', function(req, res) {

          res.render('userInfo.ejs', {
            user : req.user,
          })
    });

    app.put('/userInfo', (req, res) => {
      const id = ObjectId(req.user.id)
      console.log('id is: ', id);

      console.log(req.body);

      // console.log('id is..........' + id);
      db.collection('users')
      .findOneAndUpdate({_id:id}, {
          $set: {
            first: req.body.first,
            last: req.body.last,
            callName: req.body.callName,
            country: req.body.country,
            address: req.body.address,
            apartment: req.body.apartment,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            phone: req.body.phone,
            payment: req.body.payment
          }
        }, {
        sort: {_id: -1}
        }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        })
  })


    app.get('/checkout/:id/:table', isLoggedIn, function(req, res) {
      const id = ObjectId(req.user._id)
      const table = req.params.table
      const date = new Date()

      //retrieve information based on where the request came from
      // to send info
      const restaurantID = ObjectId(req.headers.referer.split('/')[4])
      const currentTable = req.headers.referer.split('/')[5]
      console.log(restaurantID);
      console.log(id);
      console.log(table);

        let inCart = false;
        console.log('searching for orders in checkout');
        db.collection('orders')
        .find( { user:req.user.local.email, inCart:true } ).toArray((err, result) => {
            if (err) return console.log(err)

            // declare recentorders
            let recentOrders

            //confirm if theres anything in the cart
            if( result.length ){
              // filters out all orders within 45 min
              recentOrders = result.filter((item)=>{
                    const timeSinceCarted = (date.getTime()-parseInt(item.time))
                    return (timeSinceCarted < 2700000)
              })
              //confirm if theres anything within the cart after filter orders under 30 min
              if (recentOrders.length){
                  console.log('pre sort:', recentOrders);
                  //sort from the most recent, smalled millisecond value
                  // console.log(`test1
                  //   ${parseInt(recentOrders[0].time)-parseInt(recentOrders[1].time)}`);
                  recentOrders = recentOrders.sort( ( a, b )=> parseInt( b.time ) - parseInt( a.time ) )
                  //compare the first, most recent order
                    if ((date.getTime() - parseInt(recentOrders[0].time)) < 1800000) {
                          inCart = true;
                          console.log('inCart is TRUE because of :' , recentOrders);
                        }
              }
            }
              // console.log('is the previous order, 20min: ', recentOrders );

              //after filtering
            console.log('searching for the users data');

            db.collection('users')
            .find( { _id : id } ).toArray((err, resp) => {
                if (err) return console.log(err)

                console.log(`user data is :::
                  ${resp[0]}`);
                  // console.log(resp[0].last);

                // console.log(rest[0].order);
                if (inCart===true) {
                  console.log('made it to checkout with a carted item');
                  console.log(recentOrders[0].order.length + ' items');
                  res.render('checkout.ejs', {
                    user : req.user,
                    userInfo: resp[0],
                    order:recentOrders[0]
                  })
                }
                // else {
                //   console.log('made it to restaurant');
                //   res.render('checkout.ejs', {
                //     user : req.user,
                //     menu: rest[0].menu,
                //     cart:0
                //   })
                // }

            })


        })

    })

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      console.log('made it to profile');
      const id = ObjectId(req.user._id)
      console.log(id);
      db.collection('users')
      .find( { _id : id } ).toArray((err, result) => {
          if (err) return console.log(err)

          console.log(result[0]);

          // console.log(result[].ingo);
          res.render('profile.ejs', {
            user : result[0]
          })



      })


})




    //after user scans, to show restuarant
    app.get('/restaurant/:id/:table', isLoggedIn, function(req, res) {
      console.log('restaurant get');
      const id = ObjectId(req.params.id)
      console.log(id);
      const table = req.params.table
      let date = new Date()
      let timePlace;
      let datePlaced;
      let userId = ObjectId(req.user._id)

      console.log(id, table);
      console.log(req.user._id);

      // search for any orders inCart
      let inCart = false;
      console.log('searching for orders');
      db.collection('orders')
      .find( { user:req.user.local.email, inCart:true, completed:false } ).toArray((err, result) => {
          if (err) return console.log(err)

          // declare recentorders
          let recentOrders

          //confirm if theres anything in the cart
          if( result.length ){
            // filters out all orders within 45 min
            recentOrders = result.filter((item)=>{
                  const timeSinceCarted = (date.getTime()-parseInt(item.time))
                  return (timeSinceCarted < 2700000)
            })
            //confirm if theres anything within the cart after filter orders under 20 min
            if (recentOrders.length){

                //sorts from the most recent, smalled millisecond value
                recentOrders = recentOrders.sort((a,b)=>b-a)

                //compares the first, most recent order makes sure its under 20min
                  if ((date.getTime()-parseInt(recentOrders[0].time)) < 1200000) {
                        inCart = true;
                        console.log('inCart is TRUE because of :' , recentOrders[0]);
                      }
            }
          }
            // console.log('is the previous order, 20min: ', recentOrders );

            //after filtering
          console.log('searching for restaurant data');
          db.collection('restaurant')
          .find( { _id : id } ).toArray((err, rest) => {
              if (err) return console.log(err)
              // console.log(rest[0].order);
              if (inCart===true) {
                console.log('made it to restaurant with a carted item');
                console.log(recentOrders[0].order.length + ' dishes');
                res.render('restaurant.ejs', {
                  user : req.user,
                  menu: rest[0].menu,
                  cart:recentOrders[0],
                  table:table
                })
              }
              else {
                console.log('images source', rest[0].menu[0].img);
                console.log('made it to restaurant');
                res.render('restaurant.ejs', {
                  user : req.user,
                  menu: rest[0].menu,
                  cart:0,
                  table:table
                })
              }

          })
    })
  })

    app.post('/order', (req, res) => {
      console.log('orrrrrrrderrrrrrrrr UPPPPPP');
      //retrieve information based on where the request came from
      const restaurantID = req.headers.referer.split('/')[4]
      const currentTable = req.headers.referer.split('/')[5]
      //view output
      let newTotal;
      console.log(restaurantID, currentTable);

      ///////////// to make sure the total is correct
      console.log(req.body.total);
      //confirms there are more then one dishes in the order
      if (req.body.order.length>1) {
        //reduce values to find a new total
        newTotal = req.body.order.reduce((a,b)=>{
          return ((a.price*a.quantity)+(b.price*b.quantity))
        })
        console.log(newTotal);
        newTotal = newTotal[0]
      }
      else{
        //if theres one dish
        newTotal = req.body.order[0].price * req.body.order[0].quantity
        console.log(newTotal);
      }

      let date = new Date()
      console.log(`newTotal is ${newTotal} before save request`);
      db.collection('orders').save({
        restaurantID:restaurantID,
        table:currentTable,
        user:req.user.local.email,
        order: req.body.order,
        total:parseInt(req.body.total),
        date:req.body.date,
        completed:false,
        confirmed:false,
        inCart:true,
        time: date.getTime()
    }, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.json({
      restaurantID : restaurantID,
      table:currentTable
    })
    // res.send('order upp')

  })
})

app.put('/confirmOrder', (req, res) => {
    console.log('orrrrrrrderrrrrrrrr UPPPPPP');
    //retrieve information based on where the request came from
    const restaurantID = req.headers.referer.split('/')[4]
    const currentTable = req.headers.referer.split('/')[5]
    const orderID = ObjectId(req.body.orderID)
    let date = new Date()
    time: `${date.getTime()}`,

    db.collection('orders')
    .findOneAndUpdate({_id:orderID} , {
          $set: {
            confirmed: true,
            billingDetails:req.body.billingDetails
          }
        }, {
        sort: {_id: -1}
        }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        })
  })

  app.put('/complete', (req, res) => {
    const id = ObjectId(req.body.order)
    console.log('id is: ', id);

    const date = new Date()
    // console.log('id is..........' + id);
    db.collection('orders')
    .findOneAndUpdate({_id:id}, {
        $set: {
          timeCompleted: date.getTime(),
          chef: req.user.local.email,
          completed: true,
        }
      }, {
      sort: {_id: -1}
      }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
      })
})

/////////////////////////////////// Employee Hub ///////////////////////////////////////

    app.get('/employeeHub', isLoggedIn, function(req, res) {

      //pulls up restaurant info .... used to confirm if user is an admin at there restaurant
      db.collection('restaurant')
      .find( { name : 'Brothers Pizza' } ).toArray((err, restaurant) => {
          if (err) return console.log(err)

          const date = new Date()
          let isAdmin = false
          //confirms if the user is an admin
          restaurant[0].users.forEach((item, i) => {
            if (item.user === req.user.local.email && item.type === 'admin') {
              isAdmin = true
              console.log('Admin Access: ', isAdmin);
            }
          });
          db.collection('orders')
          .find( { confirmed : true } ).toArray((err, result) => {
            if (err) return console.log(err)

            // retrieve confirmed orders
            const confirmedOrders = result.filter( order => ( order.confirmed === true  &&  order.completed === false ) )

            // retrieve completed orders for the admin
            let completedOrders = result.filter( order => ( order.confirmed === true  &&  order.completed === true ) )

            // add duration to the array
            completedOrders = completedOrders.map( order => {
              order.duration = parseFloat(order.timeCompleted) - parseFloat(order.time);
              return order;
            })

            let total;
            if (completedOrders.length){
              total = completedOrders.reduce( (a , c) => a.total + c.total)
            }

            const currentDayOfWeek = date.getDay()
            const currentDate = date.getDate()

            const todaysOrders = completedOrders.filter( order => {
              const orderDOW = new Date(order.timeCompleted).getDay()
              const orderDate = new Date(order.timeCompleted).getDate()

              return (currentDayOfWeek === orderDOW  &&  currentDate === orderDate)
            })
            let todaysCurrentTotal = 0;
            if (todaysOrders.length) {
              todaysCurrentTotal = todaysOrders.reduce( (a , c) => a.total + c.total)
            }

            console.log(todaysOrders);
            //current total
                  res.render('employeeHub.ejs', {
                    user : req.user,
                    confirmed: confirmedOrders,
                    completed: completedOrders,
                    isAdmin:isAdmin,
                    total:total,
                    todaysCurrentTotal : todaysCurrentTotal,
                    currentTime: `${date.getMonth()+1}/${date.getDate()}  ${date.getHours()}:${date.getMinutes()}`,
                  })
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.delete('/deletepost', (req, res) => {
      db.collection('job board').findOneAndDelete({user: req.user.local.email, company: req.body.company, description: req.body.description, location: req.body.location, urgent:req.body.urgent, title: req.body.title}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/userInfo', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));



        // =============================================================================
        // RESTAURANT LOGIN ==================================================
        // =============================================================================

            // locally --------------------------------
                // LOGIN ===============================
                // show the login form
                app.get('/restLogin', function(req, res) {
                    res.render('restLogin.ejs', { message: req.flash('loginMessage') });
                });

                // process the login form
                app.post('/restLogin', passport.authenticate('local-login', {
                    successRedirect : '/employeeHub', // redirect to the secure profile section
                    failureRedirect : '/restLogin', // redirect back to the signup page if there is an error
                    failureFlash : true // allow flash messages
                }));

                // SIGNUP =================================
                // show the signup form
                app.get('/restSignup', function(req, res) {
                  console.log('sign up');
                    res.render('restSignup.ejs', { message: req.flash('signupMessage') });
                });

                // process the signup form
                app.post('/restSignup', passport.authenticate('local-signup', {
                    successRedirect : `/employeeHub`, // redirect to the secure profile section
                    failureRedirect : '/restSignup', // redirect back to the signup page if there is an error
                    failureFlash : true // allow flash messages
                }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
