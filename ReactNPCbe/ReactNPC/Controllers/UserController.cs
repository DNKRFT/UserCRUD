using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ReactNPC.Models;
using Microsoft.EntityFrameworkCore;

namespace ReactNPC.Controllers
{
    /// <summary>
    /// Api controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly UserDbContext _userDbContext;

        /// <summary>
        /// Creates userDBcontext
        /// </summary>
        /// <param name="userDbContext"></param>
        public UserController(UserDbContext userDbContext)
        {
            _userDbContext = userDbContext;
        }

        /// <summary>
        /// Processes get request
        /// </summary>
        /// <returns>Returns users info</returns>
        [HttpGet]
        [Route("GetUser")]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _userDbContext.User.ToListAsync();
        }

        /// <summary>
        /// Processes post request
        /// </summary>
        /// <param name="objUser">New user entry</param>
        /// <returns>Returns objUser if given email does not exists already</returns>
        [HttpPost]
        [Route("AddUser")]
        public async Task<User> AddUser(User objUser)
        {
            //Checks if user with given email already exists
            var user = _userDbContext.User.FirstOrDefault(usr => usr.Email == objUser.Email);
            if(user == null)
            {
                _userDbContext.User.Add(objUser);
                await _userDbContext.SaveChangesAsync();
                return objUser;
            }
            else
            {
                return null;
            }
            
        }

        /// <summary>
        /// Processes patch request
        /// </summary>
        /// <param name="objUser">Current user entry</param>
        /// <returns>Returns objUser if given email does not exists already</returns>
        [HttpPatch]
        [Route("UpdateUser/{id}")]
        public async Task<User> UpdateUser(User objUser)
        {
            if(_userDbContext.User.Where(usr => usr.Email == objUser.Email).ToList().Count < 1)
            {
                _userDbContext.Entry(objUser).State = EntityState.Modified;
                await _userDbContext.SaveChangesAsync();
                return objUser;
            }
            else
            {
                return null;
            }
            
        }


        /// <summary>
        /// Processes delete request
        /// </summary>
        /// <param name="id">User's ID</param>
        /// <returns>Returns true after deleting the user</returns>
        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public bool DeleteUser(int id)
        {
            bool a = false;
            var user = _userDbContext.User.Find(id);
            if (user != null)
            {
                a = true;
                _userDbContext.Entry(user).State = EntityState.Deleted;
                _userDbContext.SaveChanges();
            }
            else
            {
                a = false;
            }

            return a;
        }


        /// <summary>
        /// Processes login request
        /// </summary>
        /// <param name="email">User's email</param>
        /// <returns>Returns password if user with given email exists</returns>
        [HttpGet]
        [Route("LoginUser/{email}")]
        public string LoginUser(string email)
        {
            string a = "-";
            //Returns hashed password if user with given email exists
            var user = _userDbContext.User.FirstOrDefault(usr => usr.Email == email);
            if (user != null)
            {
                a=user.Password;
            }
            else
            {
                a = "-";
            }

            return a;
        }
    }
}
