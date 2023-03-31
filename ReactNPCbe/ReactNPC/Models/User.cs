using System.ComponentModel.DataAnnotations;

namespace ReactNPC.Models
{
    /// <summary>
    /// Database table model
    /// </summary>
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }    
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public string Other { get; set; }
        public string PhoneNumber { get; set; }
        public string Birthdate { get; set; }

    }
}
