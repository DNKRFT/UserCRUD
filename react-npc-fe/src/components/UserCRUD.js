import axios from "axios";
import { useEffect, useState } from "react";
import bcrypt from 'bcryptjs';
 
/** 
 * @module UserCRUD
 */
/**
 * Main UI
 * @returns Returns UI
 */
function UserCRUD() {
 
  //Input data storage
  const [Id, setId] = useState("");
  const [Name, setName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Category, setCategory] = useState("Business");
  const [SubCategory, setSubCategory] = useState("Boss");
  const [Other, setOther] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Birthdate, setBirthdate] = useState("");

  //View mode(0-register, 1-update, 2-login)
  var [mode, setMode] = useState(2);

  //User details
  var [showUser, setShowUser] = useState(false);
  var [currentUser, setCurrentUser] = useState();

  //Collection of users from db
  var [users, setUsers] = useState([]);

    useEffect(() => {
      (async () => await Load())();
    }, []);
    
    /**
     * Gets collection of users from database (sends info to the server)
     * @memberof module:UserCRUD
     * @inner
     */
    async function Load() {
      
      const result = await axios.get("https://localhost:7228/api/User/GetUser");
      setUsers(result.data);
    }

    /**
     * Adds user into database if given data is correct (sends info to the server)
     * @param {*} event Stores user details
     * @memberof module:UserCRUD
     * @inner
     */
    async function save(event) {
    
      event.preventDefault();

      //Regular expressions taken from the web
      var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      var pasRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

      //These are mine ;)
      var phoneRegex = new RegExp("^[0-9]{9}");
      var dateRegex = new RegExp("^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}");

      //Stores form correctness
      var isCorrect=true;

      //String of merged input errors
      var alertInfo="";

      //Local variables
      var SubCategoryX=SubCategory;
      var OtherX=Other;
      

      //Correct categories data 
      if(Category==="Business"){
        OtherX="-";
      }else if (Category==="Other"){
        SubCategoryX="-";
      }else if (Category==="Private"){
        SubCategoryX="-";
        OtherX="-";
      }
      

      //Check if input data is correct
      if(Name===""){
        isCorrect=false;
        alertInfo+="Input your name. ";
      }

      if(LastName===""){
        isCorrect=false;
        alertInfo+="Input your last name. ";
      }

      if(!Email.match(emailRegex)){
        isCorrect=false;
        alertInfo+="Incorrect email form. ";
      }

      if(!Password.match(pasRegex)){
        isCorrect=false;
        alertInfo+="Password to weak. Password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character, and be 8 characters or longer. ";
      }

      if(!PhoneNumber.match(phoneRegex)){
        isCorrect=false;
        alertInfo+="Incorrect phone number. ";
      }

      if(!Birthdate.match(dateRegex)){
        isCorrect=false;
        alertInfo+="Incorrect date form. ";
      }

      try {
        if(isCorrect){
          const result = await axios.post("https://localhost:7228/api/User/AddUser", {
            name: Name,
            lastName: LastName,
            email: Email,
            password: bcrypt.hashSync(Password,10),
            category: Category,
            subCategory: SubCategoryX,
            other: OtherX,
            phoneNumber: PhoneNumber,
            birthdate: Birthdate
            
            });

            //Checks if given email already exists
            if(result.data!=""){
              alert("User added");
              //Clears input fields and sets defaults
              setId("");
              setName("");
              setLastName("");
              setEmail("");
              setPassword("");
              setCategory("Business");
              setSubCategory("Boss");
              setOther("");
              setPhoneNumber("");
              setBirthdate("");
            }else{
              alert("Given email already exsts");
            }
            
            
        }else{

          //Shows errors if input is not correct
          alert(alertInfo);
        }
      
        Load();
      } catch (err) {
        alert(err);
      }
    }
   
    /**
     * Fills input fields with selected user data while editing the entry
     * @param {Object} user Current user object
     * @memberof module:UserCRUD
     * @inner
     */
    async function EditUser(user) {
      setName(user.name);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword(user.password);
      setCategory(user.category);
      setSubCategory(user.subCategory);
      setOther(user.user);
      setPhoneNumber(user.phoneNumber);
      setBirthdate(user.birthdate);
      setMode(1);
    
      setId(user.id);
    }
   
    /**
     * Deletes user from db (sends info to the server)
     * @param {number} Id Selected user's ID
     * @memberof module:UserCRUD
     * @inner
     */
    async function DeleteUser(Id) {
    await axios.delete("https://localhost:7228/api/User/DeleteUser/" + Id);
     alert("User deleted");
     setId("");
     setName("");
     setLastName("");
     setEmail("");
     setPassword("");
     setCategory("Business");
     setSubCategory("Boss");
     setOther("");
     setPhoneNumber("");
     setBirthdate("");
     Load();
     setMode(0);
    }
   
    /**
     * Edits user info if given data is correct (sends info to the server)
     * @param {*} event Stores user details
     * @memberof module:UserCRUD
     * @inner
     */
    async function update(event) {
      event.preventDefault();

      var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      var pasRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      var phoneRegex = new RegExp("^[0-9]{9}");
      var dateRegex = new RegExp("^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}");

      var isCorrect=true;
      var alertInfo="";

      var SubCategoryX=SubCategory;
      var OtherX=Other;
      
      if(Category==="Business"){
        OtherX="-";
      }else if (Category==="Other"){
        SubCategoryX="-";
      }else if (Category==="Private"){
        SubCategoryX="-";
        OtherX="-";
      }
      
      if(Name===""){
        isCorrect=false;
        alertInfo+="Input your name. ";
      }

      if(LastName===""){
        isCorrect=false;
        alertInfo+="Input your last name. ";
      }

      if(!Email.match(emailRegex)){
        isCorrect=false;
        alertInfo+="Incorrect email form. ";
      }

      if(!Password.match(pasRegex)){
        isCorrect=false;
        alertInfo+="Password to weak. Password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character, and be 8 characters or longer. ";
      }

      if(!PhoneNumber.match(phoneRegex)){
        isCorrect=false;
        alertInfo+="Incorrect phone number. ";
      }

      if(!Birthdate.match(dateRegex)){
        isCorrect=false;
        alertInfo+="Incorrect date form. ";
      }

      try {
        if(isCorrect){

          const result = await axios.patch("https://localhost:7228/api/User/UpdateUser/"+ users.find((u) => u.id === Id).id || Id,
          {
          id: Id,
          name: Name,
          lastName: LastName,
          email: Email,
          password: bcrypt.hashSync(Password,10),
          category: Category,
          subCategory: SubCategoryX,
          other: OtherX,
          phoneNumber: PhoneNumber,
          birthdate: Birthdate,
          }
        );
        //Checks if given email already exists
        if(result.data!=""){
          alert("User edited");
          setShowUser(false);
          setId("");
          setName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setCategory("Business");
          setSubCategory("Boss");
          setOther("");
          setPhoneNumber("");
          setBirthdate("");
          setMode(0);
        }else{
          alert("Given email already exsts");
        }
        

        }else{
          alert(alertInfo);
        }
    
        Load();
      } catch (err) {
        alert(err);
      }
    }

    
    /**
     * Shows user details
     * @param {Object} currentUser User whose data is being shown
     * @memberof module:UserCRUD
     * @inner
     * @returns Returns row of currentUser data
     */
    function ShowUser(currentUser) {
      
      return (
        <>
        <td>{currentUser.id}</td>
        <td>{currentUser.name}</td>
        <td>{currentUser.lastName}</td>
        <td>{currentUser.email}</td>
        <td>{currentUser.password}</td>
        <td>{currentUser.category}</td>
        <td>{currentUser.subCategory}</td>
        <td>{currentUser.other}</td>
        <td>{currentUser.phoneNumber}</td>
        <td>{currentUser.birthdate}</td>
        </>
      );
    }

    /**
     * Logs the user in (sends info to the server)
     * @param {*} event Stores user details
     * @memberof module:UserCRUD
     * @inner
     */
    async function login(event) {
      event.preventDefault();
      try{
        const result = await axios.get("https://localhost:7228/api/User/LoginUser/"+Email);
       bcrypt.compare(Password,result.data, function(err, isMatch){
        if(err){
          throw err;
        }else if (!isMatch){
          alert("Incorrect credentials");
        }else{
          alert("Logged in");
          setMode(0);
        }
       })

       setEmail("");
       setPassword("");

       Load();
       
      }catch (err){
        alert("Fill all the fields");
      }
    
    }

    /**
     * Sets login view mode
     * @param {*} event Stores user details
     * @memberof module:UserCRUD
     * @inner
     */
    function setMode2(event) {
      event.preventDefault();
      setMode(2);
    }

    /**
     * Sets register view mode
     * @param {*} event Stores user details
     * @memberof module:UserCRUD
     * @inner
     */
    function setMode0(event) {
      event.preventDefault();
      setMode(0);
      setId("");
      setName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setCategory("Business");
      setSubCategory("Boss");
      setOther("");
      setPhoneNumber("");
      setBirthdate("");
    }

    return (
      <div>
        <div>
        <h1>CIA DATABASE</h1>
        {/* Data input fields */}
      <div className="container">
        <form>
          {mode!=2
          ? <>
            <div>
              <input
                type="text"
                id="Id"
                hidden
                value={Id}
                onChange={(event) => {
                  setId(event.target.value);
                }}
              />
              <label>Name </label>
              <input
                type="text"
                id="Name"
                value={Name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            <div>
              <label>Last Name  </label>
              <input
                type="text"
                id="LastName"
                value={LastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
            </div>
            </>
          : <></>
          }
          
          <div>
            <label>Email  </label>
            <input
              type="text"
              id="Email"
              value={Email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div>
            <label>Password </label>
            <input
              type="password"
              id="Password"
              value={Password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          {mode!=2
          ?<>
            <div>
              <label>Category </label>
              <select id="Category"
                value={Category}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}>
                <option value="Business">Business</option>
                <option value="Private">Private</option>
                <option value="Other">Other</option>
              </select>
          </div>
          {Category==="Business" ?
            <>
            <div>
              <label>Subcategory  </label>
              <select id="SubCategory"
                value={SubCategory}
                onChange={(event) => {
                  setSubCategory(event.target.value);
                }}>
                <option value="Boss">Boss</option>
                <option value="Employee">Employee</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
            </>
            :<></>
          }
          {Category==="Other" ?
            <>
            <div>
              <label>Other  </label>
              <input
                type="text"
                id="Other"
                value={Other}
                onChange={(event) => {
                  setOther(event.target.value);
                }}
              />
            </div>
            </>
          : <></>
          }
          <div>
            <label>Phone Number  </label>
            <input
              placeholder="123456789"
              type="text"
              id="PhoneNumber"
              value={PhoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
              }}
            />
          </div>
          <div>
            <label>Birthdate  </label>
            <input
              placeholder="DD-MM-YYYY"
              type="text"
              id="Birthdate"
              value={Birthdate}
              onChange={(event) => {
                setBirthdate(event.target.value);
              }}
            />
          </div>
          </>
          : <></>
          }
          <div>
          {mode===0        
          ? <><button onClick={save}>Register</button>
            <button onClick={setMode2}>Logout</button></>
          : mode===1 ? <><button onClick={update}>Update</button>
          <button onClick={setMode0}>Cancel</button></>
          : <button onClick={login}>Login</button>      }
          </div>
        </form>
      </div>
      <br></br>
 
      {/* User details */}
      <div>
      {showUser ?
      <>
        <table align="center">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Category</th>
              <th scope="col">Subcategory</th>
              <th scope="col">Other</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Birthdate</th>
            </tr>
          </thead>
          <tbody>
          <tr>
                 
           <>{ShowUser(currentUser)}</>
          
          </tr>
        </tbody>
        </table>
        <br></br>
        <div className="container">
          <button 
            allign="center"
            type="button"
            onClick={() => setShowUser(false)}
          >
            X
          </button></div>
        </>
        : <></>}
      </div>
      <br></br>
      <br></br>
      {/* Users table */}
      <table className="preview" align="center">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Option</th>
          </tr>
        </thead>

        {users.map(function fn(user) {
          return (
            <tbody key={user.id}>
              <tr>
                <td>{user.name}</td>
                <td>{user.lastName}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {setShowUser(true);setCurrentUser(user)}}
                  >
                    More
                  </button>
                  {mode!=2
                  ?<>
                    <button
                    type="button"
                    onClick={() => EditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => DeleteUser(user.id)}
                  >
                    Delete
                  </button>
                  </>
                  :<></>
                  }
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
      </div>
      </div>
    );
  }
  
  export default UserCRUD;
  
  