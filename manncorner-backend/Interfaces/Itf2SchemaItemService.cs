using Microsoft.AspNetCore.Mvc;

public interface ITf2SChemaItemService
{
    Task<IEnumerable<Tf2ItemSchema>> GetAllSchemaItemsAsync();
    Task<Tf2ItemSchema?> GetByDefindexAsync(int defindex);
}