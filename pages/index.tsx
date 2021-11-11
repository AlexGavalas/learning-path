import type { NextPage, GetStaticProps } from 'next';

import Link from 'next/link';

import Date from '../components/date';
import Layout from '../components/layout';
import { getSortedPostsData, Post } from '../lib/posts';

import utilStyles from '../styles/utils.module.css';

export const getStaticProps: GetStaticProps = async () => {
	const allPostsData = getSortedPostsData();

	return {
		props: {
			allPostsData,
		},
	};
};

const Home: NextPage<{ allPostsData: Post[] }> = ({ allPostsData }) => {
	return (
		<Layout>
			<section className={utilStyles.headingMd}>
				<h2 className={utilStyles.headingLg}>Notes</h2>
				<ul className={utilStyles.list}>
					{allPostsData.map(({ id, date, title }) => (
						<li className={utilStyles.listItem} key={id}>
							<Link href={`/posts/${id}`} scroll={false}>
								<a>{title}</a>
							</Link>
							<br />
							<small className={utilStyles.lightText}>
								<Date dateString={date} />
							</small>
						</li>
					))}
				</ul>
			</section>
		</Layout>
	);
};

export default Home;
