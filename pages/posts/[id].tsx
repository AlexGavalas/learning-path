import type { GetStaticProps, GetStaticPaths } from 'next';

import Head from 'next/head';
import Link from 'next/link';
import styled from '@emotion/styled';

import Layout from '../../components/layout';
import Date from '../../components/date';
import { getAllPostIds, getPostData, Post } from '../../lib/posts';

import styles from '../../styles/utils.module.css';

export const getStaticProps: GetStaticProps<
	{ postData: Post },
	{ id: string }
> = async ({ params }) => {
	if (!params || !params.id) {
		return {
			notFound: true,
		};
	}

	const postData = await getPostData(params.id);

	return {
		props: {
			postData,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = getAllPostIds();

	return {
		paths,
		fallback: false,
	};
};

const BackLink = styled.div`
	margin-block-start: 3rem;
`;

const Post = ({ postData }: { postData: Post }) => {
	return (
		<Layout>
			<Head>
				<title>{postData.title}</title>
			</Head>
			<article>
				<h1 className={styles.headingLg}>{postData.title}</h1>
				<div className={styles.lightText}>
					<Date dateString={postData.date} />
				</div>
				<div
					dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
				/>
			</article>
			<BackLink>
				<Link href="/">
					<a>← Back to home</a>
				</Link>
			</BackLink>
		</Layout>
	);
};

export default Post;
