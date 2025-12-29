using System.ComponentModel.DataAnnotations;

public class FavouriteItem : Item
{
    [Key]
    public string Id { get; set; } 
    public int  OwnerUserId { get; set; }
    public User OwnerUser { get; set; } = null!;

}