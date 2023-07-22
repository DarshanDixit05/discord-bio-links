export function isValidDiscordId(o: string): boolean {
    return (
        o.length >= 17 && // String is at least 17 chars.
        o.length <= 19 && // String is at most 19 chars.
        !isNaN(parseInt(o)) && // The parsed number is not NaN.
        parseInt(o).toString().length === o.length // The length of the string is the same whether a number was parsed or not; aka, the string only contain numbers.
    );
}