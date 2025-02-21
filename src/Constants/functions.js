import { motivationalQuotes } from "./quotes";

export const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // 12-hour format maintain karega
    minutes = minutes < 10 ? '0' + minutes : minutes; // Single digit minutes ko 0 add karke format karega

    return `${hours}:${minutes} ${ampm}`;
};


export const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
}
