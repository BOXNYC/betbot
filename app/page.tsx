import ChatForm from './components/ChatForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-2 text-[#40cf8f]">BetBot</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        What NBA bets would you like to make? Let me know player&apos;s name, point spread, and over/under.
      </p>
      <ChatForm />
    </main>
  );
}