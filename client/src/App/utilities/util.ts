export function getCookie( key: string )
{
    // no idea what this freaking regex is doing...
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}