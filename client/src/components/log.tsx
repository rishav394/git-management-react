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
				{this.props.isAdmin ? (
					<td style={{ margin: 'auto' }}>
						<img
							style={{ cursor: 'pointer' }}
							src="https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Dark-512.png"
							height="50px"
							width="40px"
							onClick={() => {
								axios.post<string[]>(`/approve/${commit.hash}`).then((res) => {
									const approvedHashes = res.data;
									this.setState({
										approvedHashes,
									});
								});
							}}
							alt={'Approve'}
						/>
					</td>
				) : this.state.approvedHashes.includes(commit.hash) ? (
					<td>Approved</td>
				) : (
					<td>Approval Pending</td>
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
							{this.props.isAdmin ? (
								<th>{'Approve'}</th>
							) : (
								<th>{'Approval Status'}</th>
							)}
						</tr>
					</thead>
					<tbody>{trs}</tbody>
				</table>
			</div>
		);
	}
}

export default Log;
