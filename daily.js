const dailyQuotes = [
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },
    {
        text: "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs"
    },
    {
        text: "The only limit to our realization of tomorrow will be our doubts of today.",
        author: "Franklin D. Roosevelt"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
        author: "Roy T. Bennett"
    },
    {
        text: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis"
    },
    {
        text: "The harder the conflict, the more glorious the triumph.",
        author: "Thomas Paine"
    },
    {
        text: "Start where you are. Use what you have. Do what you can.",
        author: "Arthur Ashe"
    },
    {
        text: "Quality is not an act, it is a habit.",
        author: "Aristotle"
    },

    {
        text: "Dream big and dare to fail.",
        author: "Norman Vaughan"
    },
    {
        text: "Opportunities don't happen. You create them.",
        author: "Chris Grosser"
    },
    {
        text: "Do what you can, with what you have, where you are.",
        author: "Theodore Roosevelt"
    },
    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent Van Gogh"
    },
    {
        text: "Hardships often prepare ordinary people for an extraordinary destiny.",
        author: "C.S. Lewis"
    },
    {
        text: "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau"
    },
    {
        text: "Don't limit your challenges. Challenge your limits.",
        author: "Unknown"
    },
    {
        text: "Push yourself, because no one else is going to do it for you.",
        author: "Unknown"
    },
    {
        text: "Dream it. Believe it. Build it.",
        author: "Unknown"
    },
    {
        text: "Small steps every day lead to big results.",
        author: "Unknown"
    },
    {
        text: "Discipline is the bridge between goals and accomplishment.",
        author: "Jim Rohn"
    },
    {
        text: "Your limitation—it’s only your imagination.",
        author: "Unknown"
    },
    {
        text: "Success is walking from failure to failure with no loss of enthusiasm.",
        author: "Winston Churchill"
    },
    {
        text: "Don't stop when you're tired. Stop when you're done.",
        author: "Unknown"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "Action is the foundational key to all success.",
        author: "Pablo Picasso"
    },
    {
        text: "If you can dream it, you can do it.",
        author: "Walt Disney"
    },
    {
        text: "Do one thing every day that scares you.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        text: "Don't wait. The time will never be just right.",
        author: "Napoleon Hill"
    },
    {
        text: "Believe in yourself and all that you are.",
        author: "Christian D. Larson"
    },
    {
        text: "Work hard in silence. Let success make the noise.",
        author: "Frank Ocean"
    },
    {
        text: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky"
    },
    {
        text: "Failure is success in progress.",
        author: "Albert Einstein"
    },
    {
        text: "The pain you feel today will be the strength you feel tomorrow.",
        author: "Unknown"
    },
    {
        text: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",
        author: "Marie Forleo"
    },
    {
        text: "Be so good they can’t ignore you.",
        author: "Steve Martin"
    },
    {
        text: "Don’t count the days, make the days count.",
        author: "Muhammad Ali"
    },
    {
        text: "If it doesn’t challenge you, it won’t change you.",
        author: "Fred DeVito"
    },
    {
        text: "Success is built on consistency.",
        author: "Unknown"
    },
    {
        text: "The comeback is always stronger than the setback.",
        author: "Unknown"
    },
    {
        text: "Focus on progress, not perfection.",
        author: "Unknown"
    },
    {
        text: "Your future depends on what you do today.",
        author: "Mahatma Gandhi"
    },
    {
        text: "Success is earned, not given.",
        author: "Unknown"
    },
    {
        text: "Every moment is a fresh beginning.",
        author: "T.S. Eliot"
    },
    {
        text: "The key to success is to focus on goals, not obstacles.",
        author: "Unknown"
    },
    {
        text: "Doubt kills more dreams than failure ever will.",
        author: "Suzy Kassem"
    },
    {
        text: "Be stronger than your excuses.",
        author: "Unknown"
    },
    {
        text: "Turn your wounds into wisdom.",
        author: "Oprah Winfrey"
    },
    {
        text: "The best view comes after the hardest climb.",
        author: "Unknown"
    },
    {
        text: "You didn’t come this far to only come this far.",
        author: "Unknown"
    },
    {
        text: "Consistency creates confidence.",
        author: "Unknown"
    },
    {
        text: "Stay hungry. Stay foolish.",
        author: "Steve Jobs"
    },
    {
        text: "Make it happen. Shock everyone.",
        author: "Unknown"
    },
    {
        text: "Winners are not afraid of losing. Losers are.",
        author: "Robert Kiyosaki"
    },
    {
        text: "Great things never come from comfort zones.",
        author: "Unknown"
    },
    {
        text: "Your only limit is you.",
        author: "Unknown"
    },
    {
        text: "Success starts with self-belief.",
        author: "Unknown"
    }
];

function getTodaysQuote() {
    const today = new Date();
    const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );
    const quoteIndex = dayOfYear % dailyQuotes.length;
    return dailyQuotes[quoteIndex];
}

if (typeof window !== 'undefined') {
    window.dailyQuotes = dailyQuotes;
    window.getTodaysQuote = getTodaysQuote;
}