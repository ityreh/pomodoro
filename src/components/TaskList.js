import React from 'react';

class TaskList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [
                {
                    description: "This is my first task",
                    startTime: new Date().toLocaleTimeString(),
                    endTime: new Date().toLocaleTimeString()
                },
                {
                    description: "This is my first task",
                    startTime: new Date().toLocaleTimeString(),
                    endTime: new Date().toLocaleTimeString()
                },
                {
                    description: "This is my first task",
                    startTime: new Date().toLocaleTimeString(),
                    endTime: new Date().toLocaleTimeString()
                }
            ]
        };
    }

    render() {
        const tasks = this.state.tasks;

        return (
            <div class="container">
                <div class="row">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>StartTime</th>
                                <th>EndTime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) =>
                                <Task descirption={task.descirption}
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
            description: props.description,
            startTime: props.startTime,
            endTime: props.endTime
        }
    }

    render() {
        const { description, startTime, endTime } = this.state;

        return (
            <tr>
                <td>{description}</td>
                <td>{startTime}</td>
                <td>{endTime}</td>
            </tr>
        );
    }
}

export default TaskList;
