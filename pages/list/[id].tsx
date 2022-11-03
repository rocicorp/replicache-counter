import { GetServerSideProps } from "next";

import { spaceExists } from "replicache-nextjs/lib/backend";
// Next.js runs this server-side.
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { params } = context;
  const { id: listID } = params as { id: string };

  // Ensure the selected space exists. It's common during development for
  // developers to delete the backend database. As a convenience, we
  // automatically pick a new one when this occurs by redirecting back to the
  // root.
  if (!(await spaceExists(listID))) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      listID,
    },
  };
};

// Runs client-side.
export default function Home() {
  return '';
}
