import axios from 'axios';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';

type State = {
	diff: string;
	message: string;
	body: string;
};

class Diff extends PureComponent<RouteComponentProps<any>, State> {
	constructor(props: RouteComponentProps<any>) {
		super(props);
		this.state = {
			diff: '',
			message: '',
			body: '',
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	async componentDidMount() {
		const diff = await axios.get<string>(`/diff`);
		this.setState({
			diff: diff.data,
		});
	}

	handleInputChange(
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
	) {
		const id = event.target.id;
		const value = event.target.value;

		if (id === 'title') {
			this.setState({
				message: value,
			});
		} else {
			this.setState({
				body: value,
			});
		}
	}

	async handleClick() {
		if (this.state.message.length === 0 || this.state.body.length === 0) {
			return alert('All fields are mandatory');
		}
		const response = await axios.post('/commit', {
			title: this.state.message,
			body: this.state.body,
		});
		if (response.status === 200) {
			this.props.history.push('/log');
		}
	}

	render() {
		return (
			<div>
				<FlexContainer>
					<Code>{this.state.diff}</Code>
					<CommitContainer>
						<CommitSubContainer>
							<h1>Commit differences</h1>
							<FlexInputContainer>
								<Label>Message</Label>
								<InputBox>
									<input
										style={{ fontSize: 22 }}
										onChange={this.handleInputChange}
										type="text"
										name="title"
										id="title"
										required
									/>
								</InputBox>
							</FlexInputContainer>
							<FlexInputContainer>
								<Label>Body</Label>
								<InputBox>
									<textarea
										style={{ fontSize: 22 }}
										onChange={this.handleInputChange}
										rows={7}
										name="body"
										id="body"
										required
									></textarea>
								</InputBox>
							</FlexInputContainer>
							<br />
							<br />
							<Button onClick={this.handleClick}>Commit</Button>
						</CommitSubContainer>
					</CommitContainer>
				</FlexContainer>
			</div>
		);
	}
}

export default Diff;

const Button = styled.button`
	align-self: center;
	text-align: center;
`;

const FlexContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

const FlexInputContainer = styled(FlexContainer)`
	justify-content: space-between;
`;

const InputBox = styled.div`
	flex: 1;
`;

const CommitContainer = styled.div`
	flex: 1;
	margin-right: 60px;
	maxwidth: 50%;
`;

const CommitSubContainer = styled.div`
	text-align: center;
	padding: 20px;
	border: 2px solid salmon;
	align-items: center;
	align-content: center;
`;

const Label = styled.label`
	flex: 0.5;
	margin: auto;
	font-size: 22px;
`;

const Code = styled.pre`
	flex: 1;
	max-width: 50%;
	overflow: hidden;
`;
