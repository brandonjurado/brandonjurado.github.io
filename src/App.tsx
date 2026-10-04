import Main from "./containers/Main";
import Metadata from "./components/metadata/Metadata";
export default function App({notFound = false}: {notFound?: boolean}) {
  return (
    <>
      <Metadata notFound={notFound} />
      {notFound ? (
        <main className="not-found">
          <p>404</p>
          <h1>Page not found</h1>
          <p>That address doesn’t lead anywhere.</p>
          <a href="/">Return to Brandon’s portfolio</a>
        </main>
      ) : (
        <Main />
      )}
    </>
  );
}
