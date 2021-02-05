import React from 'react';

class TaskList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const tasks = this.props.tasks;

        return (
            <div class="container">
                <div class="row">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>StartTime</th>
                                <th>EndTime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) =>
                                <Task title={task.title}
                                    startTime={task.startTime}
                                    endTime={task.endTime} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
class Task extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            startTime: props.startTime,
            endTime: props.startTime
        }
    }

    render() {
        const { title, startTime, endTime } = this.state;

        return (
            <tr>
                <td>{title}</td>
                <td>{startTime}</td>
                <td>{endTime}</td>
            </tr>
        );
    }
}

export default TaskList;
