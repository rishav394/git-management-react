import axios from 'axios';
import React, { PureComponent } from 'react';
import { all, commits } from '../types';

type State = {
	log: all;
	approvedHashes: string[];
};

type Props = {
	isAdmin?: boolean;
};

class Log extends PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			log: [],
			approvedHashes: [],
		};
	}

	async componentDidMount() {
		const diff = await axios.get<commits>(`/log`);
		const approvedHashes = (await axios.get<string[]>('/approvedHash')).data;

		this.setState({
			log: diff.data.all || [],
			approvedHashes,
		});
	}

	render() {
		const trs = this.state.log.map((commit) => (
			<tr
				key={commit.hash}
				style={{
					backgroundColor: this.state.approvedHashes.includes(commit.hash)
						? 'lightseagreen'
						: 'none',
				}}
			>
				<td>{commit.author_name}</td>
				<td>{commit.author_email}</td>
				<td>{commit.message}</td>
				<td>{commit.body}</td>
				<td>{commit.date}</td>
				{this.props.isAdmin && (
					<td>
						<img
							src="https://media.istockphoto.com/vectors/round-green-check-mark-thin-line-icon-button-tick-symbol-on-white-vector-id1141191243"
							height="60px"
							width="60px"
							onClick={() => {
								axios.post<string[]>(`/approve/${commit.hash}`).then((res) => {
									const approvedHashes = res.data;
									this.setState({
										approvedHashes,
									});
								});
							}}
						/>
					</td>
				)}
			</tr>
		));

		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>Author Name</th>
							<th>Author Email</th>
							<th>Message</th>
							<th>Body</th>
							<th>Date</th>
							{this.props.isAdmin && <td>{'Approve'}</td>}
						</tr>
					</thead>
					<tbody>{trs}</tbody>
				</table>
			</div>
		);
	}
}

export default Log;
