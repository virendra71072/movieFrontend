import React, {Component} from 'react';
import {connect} from "react-redux";
import "./Login.css"
const request   = require('axios');

import {Table, TableBody, TableCell, TableHead, TableRow, Paper, Tab, Tabs} from "@material-ui/core";
const apiHost = 'http://localhost:8085/api/v1';

class MovieList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            latestList: [],
            popularList: [],
            page:1,
            currentTab: 'LATEST'
        }
    }

    componentDidMount() {
        this.fetchData('LATEST',1);
        this.fetchData('POPULAR',1);

    }

    fetchData(type, page=1){
        console.log('thisffff', this.state);
        var token;
        this.httpRequest('GET',`${apiHost}/user/generateToken`,{},{},6000,  (error, result,body) => {
            token =  (!!body.response && body.response.token )? body.response.token : "";
            this.setState({token:token});
            this.httpRequest('GET',`${apiHost}/movie/list/${type}?page=${page}`,{"token": token},{},6000,  (error, result, body) => {
                if (type === 'LATEST') {
                    this.setState({"latestList": body.response});
                } else if (type === "POPULAR") {
                    this.setState({"popularList": body.response});
                }
            });
        });
    }

    /*
     * http external call (GET|POST)
     * @param string method
     * @param string url
     * @param {object} headers
     * @param {object} params
     * @param int timeout
     * @param {object} callback
     * @returns {callback}
     */
    httpRequest = function (method = 'GET', url, headers = {}, params = {}, timeout = 60000, callback) {

        if (url.length === false) {
            return callback('Url is required!');
        }

        if (headers.length === false) {
            headers = {
                "Content-Type": "application/json; charset=utf-8",
                'Access-Control-Allow-Origin': '*'

            };
        }

        const options = {
            url    : url,
            method : method,
            headers: headers,
            data   : params,
            timeout: timeout,
            crossdomain: true
        };

        request(options).then(function (response) {
                //console.log('ffffeeeee', response);
                response.body = response.data;
                delete response.data;
                return callback(null, response, response.body);
            }).catch(function (error) {
                return callback(error);
            });
    };

    setValue(newValue) {
        this.setState({'currentTab': (newValue)? 'POPULAR': 'LATEST'});
    }
    render() {
        const {latestList = [], popularList = [], page=1, currentTab} = this.state;
        console.log('render', this.state);
        let renderLatestTable = [], renderPopularTable = [], header;

        header = (<TableHead>
            <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Url</TableCell>
                <TableCell>Vote Average</TableCell>
                <TableCell>Vote Count</TableCell>
                <TableCell>Popularity</TableCell>
                <TableCell>Link</TableCell>
            </TableRow>
        </TableHead>);

        renderLatestTable.push(
            <div><h1>Latest Movie List !!</h1>
            <Table className={"employee"}>
                {header}
                <TableBody>
                    {latestList.map((movieList, i) => {
                        return (<TableRow>
                            <TableCell>{movieList['movieId']}</TableCell>
                            <TableCell><img src={movieList['image']} width={40} /></TableCell>
                            <TableCell>{movieList['title']}</TableCell>
                            <TableCell>{movieList['url']}</TableCell>
                            <TableCell>{movieList['voteAverage']}</TableCell>
                            <TableCell>{movieList['voteCount']}</TableCell>
                            <TableCell>{movieList['popularity']}</TableCell>
                            <TableCell><a href={'movie/'+movieList['url']}>Link</a></TableCell>
                         </TableRow>)
                    })}
                </TableBody>
            </Table></div>);

        renderPopularTable.push(
            <div><h1>Popular Movie List !!</h1>
            <Table className={"employee"}>
                {header}
                <TableBody>
                    {popularList.map((movieList, i) => {
                        return (<TableRow>
                            <TableCell>{movieList['movieId']}</TableCell>
                            <TableCell><img src={movieList['image']} width={40} /></TableCell>
                            <TableCell>{movieList['title']}</TableCell>
                            <TableCell>{movieList['url']}</TableCell>
                            <TableCell>{movieList['voteAverage']}</TableCell>
                            <TableCell>{movieList['voteCount']}</TableCell>
                            <TableCell>{movieList['popularity']}</TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table></div>);

        return (
            <div className={"employee_list"}>
                <Paper square>
                    <Tabs
                        value={currentTab}
                        textColor="primary"
                        indicatorColor="primary"
                        onChange={(event, newValue) => {
                            this.setValue(newValue);
                        }}
                    >
                        <Tab label="LATEST" />
                        <Tab label="POPULAR" />
                    </Tabs>
                    <div>{(currentTab === 'POPULAR')? renderPopularTable: renderLatestTable}</div>
                </Paper>

            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    dashboardData: state
});

export default connect(mapStateToProps, {})(MovieList);
