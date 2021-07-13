import React, {Component} from 'react';
import {connect} from "react-redux";
import "./Login.css"
const request   = require('axios');

import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
const apiHost = 'http://localhost:8085/api/v1';

class MovieList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            movieDetail:{}
        }
    }

    componentDidMount() {
        const {movieId = ""} = this.props.match.params
        this.setState({movieId:movieId});
        if(!movieId) {
            alert('Invalid Url!');
        }
        this.fetchData(movieId,1);
    }

    fetchData(movieId){
        var token;
        console.log('+++++ movieId',movieId);
        this.httpRequest('GET',`${apiHost}/user/generateToken`,{},{},6000,  (error, result,body) => {
            token =  (!!body.response && body.response.token )? body.response.token : "";
            this.setState({token:token});
            this.httpRequest('GET',`${apiHost}/movie/${movieId}`,{"token": token},{},6000,  (error, result, body) => {
                console.log('ffff', error,body);
                this.setState({"movieDetail": body.response});
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
                response.body = response.data;
                delete response.data;
                return callback(null, response, response.body);
            }).catch(function (error) {
                return callback(error);
            });
    };

    render() {
        const {movieDetail = {}} = this.state;
        console.log('render', this.state);
        let renderTable = [];

        if (!!movieDetail) {
            renderTable.push(
                <Table className={"employee"}>
                    <TableBody>
                        <TableRow key='title'>
                            <TableCell>Title</TableCell>
                            <TableCell>{movieDetail['title']}</TableCell>
                        </TableRow>
                        <TableRow key='image'>
                            <TableCell>Image</TableCell>
                            <TableCell><img src={movieDetail['backdrop_path']} width={40}/></TableCell>
                        </TableRow>
                        <TableRow key='overview'>
                            <TableCell>Overview</TableCell>
                            <TableCell>{movieDetail['overview']}</TableCell>
                        </TableRow>
                        <TableRow key='popularity'>
                            <TableCell>Popularity</TableCell>
                            <TableCell>{movieDetail['popularity']}</TableCell>
                        </TableRow>
                        <TableRow key='release_date'>
                            <TableCell>Release Date</TableCell>
                            <TableCell>{movieDetail['release_date']}</TableCell>
                        </TableRow>
                        <TableRow key='revenue'>
                            <TableCell>Revenue</TableCell>
                            <TableCell>{movieDetail['revenue']}</TableCell>
                        </TableRow>
                        <TableRow key='tagline'>
                            <TableCell>Tagline</TableCell>
                            <TableCell>{movieDetail['tagline']}</TableCell>
                        </TableRow>
                        <TableRow key='vote_average'>
                            <TableCell>Rattig</TableCell>
                            <TableCell>{movieDetail['vote_average']} out of {movieDetail['vote_count']}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>);
        }



        return (
            <div className={"employee_list"}>
                <h1>Movie Detail !!</h1>
                <div>{renderTable}</div>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    dashboardData: state
});

export default connect(mapStateToProps, {})(MovieList);
