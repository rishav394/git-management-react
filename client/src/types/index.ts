export type all = {
	author_email: string;
	author_name: string;
	body: string;
	date: string;
	hash: string;
	message: string;
	refs: string;
}[];

export type commits = {
	all: all;
};
