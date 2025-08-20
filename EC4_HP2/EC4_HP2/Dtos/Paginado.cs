namespace EC4_HP2.Dtos
{
    public class Paginado<T>
    {
        public int Total { get; init; }
        public int Page { get; init; }
        public int PageSize { get; init; }
        public IEnumerable<T> Items { get; init; } = Enumerable.Empty<T>();
    }

}
